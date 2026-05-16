import express from 'express';
import multer from 'multer';
import FineTuneData from '../models/FineTuneData.js';
import imageAnalyse from '../ai/imageanalyse.js';
import Transaction from '../models/Transaction.js';
import { requireRole } from '../middleware/auth.js';
import { uploadImageBuffer } from '../services/cloudinaryStorage.js';

const { processImage } = imageAnalyse;

const router = express.Router();

function normalizeTag(value) {
    return String(value || '').toUpperCase().replace(/[^A-Z0-9@#]/g, '');
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: Number(process.env.AI_UPLOAD_MAX_BYTES ?? 10 * 1024 * 1024)
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype?.startsWith('image/')) {
            cb(new Error('Only image uploads are supported.'));
            return;
        }

        cb(null, true);
    }
});

// POST /api/ai/verify-scan
router.post('/verify-scan', requireRole('influencer'), upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded.' });
        }

        const cloudinaryImage = await uploadImageBuffer(req.file.buffer, req.file.originalname);

        // You can pass the required tag from the frontend (e.g., from the QR code data)
        // Defaulting to @PUB2WIN if the frontend doesn't send one
        const expectedTag = normalizeTag(req.body.requiredTag || '@PUB2WIN');
        const { transactionId } = req.body;

        // 1. Run the Image through your AI pipeline
        const aiData = await processImage(cloudinaryImage.url);

        // 2. APPROVAL LOGIC
        // Force all detected text to uppercase so we don't fail on lowercase typos
        const visibleText = aiData.visible_text || [];
        const normalizedTextItems = visibleText.map(normalizeTag);
        const normalizedTextBlob = normalizeTag(visibleText.join(' '));

        const hasTag = normalizedTextItems.includes(expectedTag) || normalizedTextBlob.includes(expectedTag);
        const isRestaurant = aiData.is_restaurant;

        let status = 'denied';
        let reason = 'Image did not meet requirements.';

        if (hasTag && isRestaurant) {
            status = 'approved';
            reason = 'Valid tag and location detected! Waiting for admin approval.';
        } else {
            if (!hasTag && isRestaurant) {
                reason = `Location verified, but missing tag: ${expectedTag}`;
            } else if (hasTag && !isRestaurant) {
                reason = 'Tag found, but location does not look like a valid establishment.';
            }
        }

        // Always set transaction to in_review, letting Admin decide
        if (transactionId) {
            const transaction = await Transaction.findById(transactionId);
            if (transaction && transaction.status === 'pending') {
                transaction.status = 'in_review';
                await transaction.save();
            }
        }

        // 3. Save to MongoDB for your Fine-Tuning later!
        const newEntry = new FineTuneData({
            imageUrl: cloudinaryImage.url,
            cloudinaryPublicId: cloudinaryImage.publicId,
            transactionId: transactionId || null,
            adminStatus: 'pending', // Waiting for admin review
            conversations: [
                { from: "human", value: "Extract the visible text and determine if this is a restaurant." },
                { from: "gpt", value: JSON.stringify(aiData) }
            ]
        });
        await newEntry.save();

        // 4. Send the final verdict back to the frontend
        res.status(200).json({
            success: true,
            status: status, // "approved" or "denied"
            reason: reason,
            image_url: cloudinaryImage.url,
            ai_data: aiData
        });

    } catch (error) {
        console.error("AI Verification Error:", error);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});

export default router;
