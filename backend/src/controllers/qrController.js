import { v4 as uuidv4 } from 'uuid';
import QRVisit from '../models/QRVisit.js';
import Offer from '../models/Offer.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { logActivity } from '../config/logger.js';

// ─── POST /api/qr/generate ────────────────────────────────────────────────────
// Merchant generates a QR token tied to one of their offers.
export async function generateQR(req, res) {
  try {
    const merchantId = req.auth?.userId; // MongoDB _id string
    const { offerId, winCoins = 1, ttlHours = 1 } = req.body;

    if (!offerId) {
      return res.status(400).json({ success: false, message: 'offerId is required' });
    }

    // Verify the offer belongs to this merchant
    const offer = await Offer.findOne({ _id: offerId, merchantId });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found or access denied' });
    }

    if (!offer.isActive) {
      return res.status(400).json({ success: false, message: 'Cannot generate QR for an inactive offer' });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    const qrVisit = await QRVisit.create({
      token,
      merchantId,
      offerId: offer._id,
      label: offer.establishmentName,
      winCoins: Number(winCoins),
      expiresAt,
    });

    logActivity('info', {
      userId: merchantId,
      action: 'qr.generate',
      status: 'success',
      message: `QR generated for offer ${offerId}`,
    });

    return res.status(201).json({
      success: true,
      qrVisit: {
        _id: qrVisit._id,
        token: qrVisit.token,
        label: qrVisit.label,
        winCoins: qrVisit.winCoins,
        expiresAt: qrVisit.expiresAt,
        scanned: qrVisit.scanned,
        createdAt: qrVisit.createdAt,
      },
    });
  } catch (err) {
    logActivity('error', { action: 'qr.generate', status: 'failed', message: err.message });
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ─── GET /api/qr/mine ────────────────────────────────────────────────────────
// Merchant lists all QR codes they have generated.
// Each scanned record includes the influencer's full name and transaction status.
export async function listMerchantQRs(req, res) {
  try {
    const merchantId = req.auth?.userId;

    const qrVisits = await QRVisit.find({ merchantId })
      .populate('offerId', 'establishmentName')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Collect unique influencer IDs from scanned visits
    const influencerIds = [...new Set(
      qrVisits.filter((q) => q.scanned && q.scannedBy).map((q) => q.scannedBy)
    )];

    // Collect unique transaction IDs
    const transactionIds = [...new Set(
      qrVisits.filter((q) => q.transactionId).map((q) => String(q.transactionId))
    )];

    // Fetch influencers and transactions in parallel
    const [influencers, transactions] = await Promise.all([
      User.find({ _id: { $in: influencerIds } }).select('firstName lastName').lean(),
      Transaction.find({ _id: { $in: transactionIds } }).select('status').lean(),
    ]);

    const influencerMap = Object.fromEntries(
      influencers.map((u) => [String(u._id), `${u.firstName || ''} ${u.lastName || ''}`.trim()])
    );
    const txMap = Object.fromEntries(
      transactions.map((t) => [String(t._id), t.status])
    );

    // Attach enriched fields to each visit
    const enriched = qrVisits.map((q) => ({
      ...q,
      scannedByName: q.scannedBy ? (influencerMap[q.scannedBy] || 'Unknown') : null,
      transactionStatus: q.transactionId ? (txMap[String(q.transactionId)] || null) : null,
    }));

    return res.json({ success: true, qrVisits: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ─── POST /api/qr/scan ────────────────────────────────────────────────────────
// Influencer scans a QR code token to verify physical presence.
// Creates a PENDING transaction (influencer gains winCoins — pending AI verification).
export async function scanQR(req, res) {
  try {
    const influencerUserId = req.auth?.userId; // MongoDB _id string
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'QR token is required' });
    }

    // Look up the QR record
    const qrVisit = await QRVisit.findOne({ token });
    if (!qrVisit) {
      return res.status(404).json({ success: false, message: 'Invalid QR code' });
    }

    // Check expiry
    if (new Date() > qrVisit.expiresAt) {
      return res.status(410).json({ success: false, message: 'This QR code has expired' });
    }

    // Prevent double-scan
    if (qrVisit.scanned) {
      return res.status(409).json({ success: false, message: 'This QR code has already been used' });
    }

    // Prevent merchant scanning their own code
    if (qrVisit.merchantId === influencerUserId) {
      return res.status(403).json({ success: false, message: 'You cannot scan your own QR code' });
    }

    // Create a PENDING transaction for the influencer
    const transaction = await Transaction.create({
      userId: influencerUserId,
      type: 'gain',
      amount: qrVisit.winCoins,
      fee: 0,
      description: `QR Visit verified @ ${qrVisit.label}`,
      offerId: qrVisit.offerId,
      status: 'pending',
    });

    // Mark QR as used
    qrVisit.scanned = true;
    qrVisit.scannedBy = influencerUserId;
    qrVisit.scannedAt = new Date();
    qrVisit.transactionId = transaction._id;
    await qrVisit.save();

    logActivity('info', {
      userId: influencerUserId,
      action: 'qr.scan',
      status: 'success',
      message: `QR scanned for offer ${qrVisit.offerId} | tx ${transaction._id}`,
    });

    return res.json({
      success: true,
      message: `Visit verified! ${qrVisit.winCoins} WinCoin(s) are pending transfer.`,
      transaction: {
        _id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
      qrVisit: {
        label: qrVisit.label,
        winCoins: qrVisit.winCoins,
        scannedAt: qrVisit.scannedAt,
      },
    });
  } catch (err) {
    logActivity('error', { action: 'qr.scan', status: 'failed', message: err.message });
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ─── GET /api/qr/pending ─────────────────────────────────────────────────────
// Influencer sees all QR-based scans they have done.
export async function listInfluencerPendingQRs(req, res) {
  try {
    const influencerUserId = req.auth?.userId;

    const qrVisits = await QRVisit.find({
      scannedBy: influencerUserId,
      scanned: true,
    })
      .populate('offerId', 'establishmentName')
      .populate('transactionId', 'status amount')
      .sort({ scannedAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, qrVisits });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
