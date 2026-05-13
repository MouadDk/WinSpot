import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import FineTuneData from '../models/FineTuneData.js'; // Your fine-tuning DB model
import imageAnalyse from '../ai/imageanalyse.js'; 
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const { processImage } = imageAnalyse;

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '.jpg'; // Fallback to .jpg
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

// POST /api/ai/verify-scan
router.post('/verify-scan', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded.' });
        }

        const imagePath = req.file.path;
        
        // You can pass the required tag from the frontend (e.g., from the QR code data)
        // Defaulting to @PUB2WIN if the frontend doesn't send one
        const expectedTag = (req.body.requiredTag || '@PUB2WIN').toUpperCase();
        const { transactionId } = req.body;

        // 1. Run the Image through your AI pipeline
        const aiData = await processImage(imagePath);

        // 2. APPROVAL LOGIC
        // Force all detected text to uppercase so we don't fail on lowercase typos
        const upperCaseTags = aiData.visible_text.map(tag => tag.toUpperCase());
        
        const hasTag = upperCaseTags.includes(expectedTag);
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
            imageUrl: `/uploads/${req.file.filename}`, // Save public URL for admin review
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
            ai_data: aiData
        });

    } catch (error) {
        console.error("AI Verification Error:", error);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});

export default router;