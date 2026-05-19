import QRRedemption from '../models/QRRedemption.js';
import Offer from '../models/Offer.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { logActivity } from '../config/logger.js';

const QR_EXPIRY_MINUTES = 5;

// --- MERCHANT/WAITER GENERATES A QR CODE FOR AN OFFER ---
export const generateQR = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({ success: false, message: 'offerId is required' });
    }

    // Verify offer exists, belongs to this merchant, and is active
    const offer = await Offer.findOne({ _id: offerId, merchantId });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

    if (!offer.isActive) {
      return res.status(400).json({ success: false, message: 'Offer is not active' });
    }

    // Calculate cashback in WinCoins for one redemption (1 WinCoin = 10 MAD)
    const cashbackMAD = offer.price * offer.cashbackPercent / 100;
    const cashbackCoins = cashbackMAD / 10;

    // Check if offer has enough remaining budget
    if (offer.remainingWinCoinsBudget < cashbackCoins) {
      await Offer.findByIdAndUpdate(offer._id, { $set: { isActive: false } });
      logActivity('warn', { userId: merchantId, action: 'qr.generate.budgetCheck', status: 'failed', message: `Offer ${offerId} budget exhausted (Remaining: ${offer.remainingWinCoinsBudget}, Needed: ${cashbackCoins})` });
      return res.status(400).json({ success: false, message: 'Offer budget is exhausted. Offer has been closed.' });
    }

    // Create QR redemption record
    const expiresAt = new Date(Date.now() + QR_EXPIRY_MINUTES * 60 * 1000);

    const qr = await QRRedemption.create({
      offerId: offer._id,
      merchantId,
      snapshotPrice: offer.price,
      snapshotCashbackPercent: offer.cashbackPercent,
      snapshotItemName: offer.itemName,
      cashbackCoins,
      cashbackMAD,
      status: 'pending',
      expiresAt,
    });

    logActivity('info', { userId: merchantId, action: 'qr.generate', status: 'success', message: `QR generated for offer ${offerId}: ${qr.token.substring(0, 12)}... (Expires: ${expiresAt.toISOString()})` });

    res.status(201).json({
      success: true,
      qr: {
        token: qr.token,
        expiresAt: qr.expiresAt,
        itemName: qr.snapshotItemName,
        price: qr.snapshotPrice,
        cashbackPercent: qr.snapshotCashbackPercent,
        cashbackMAD: qr.cashbackMAD,
        cashbackCoins: qr.cashbackCoins,
      }
    });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'qr.generate', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error generating QR code', error: error.message });
  }
};

// --- CUSTOMER SCANS & REDEEMS A QR CODE ---
export const redeemQR = async (req, res) => {
  try {
    const customerId = req.auth.userId;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'QR token is required' });
    }

    // Find the QR redemption
    const qr = await QRRedemption.findOne({ token });
    if (!qr) {
      return res.status(404).json({ success: false, message: 'Invalid QR code' });
    }

    // Check if expired
    if (qr.expiresAt < new Date()) {
      if (qr.status === 'pending') {
        await QRRedemption.findByIdAndUpdate(qr._id, { $set: { status: 'expired' } });
      }
      return res.status(400).json({ success: false, message: 'QR code has expired' });
    }

    // Atomic claim step to prevent race conditions
    const claimedQr = await QRRedemption.findOneAndUpdate(
      { _id: qr._id, status: 'pending' },
      { $set: { status: 'processing' } },
      { new: true }
    );

    if (!claimedQr) {
      return res.status(400).json({ success: false, message: `QR code has already been processed or is not pending` });
    }

    // Prevent merchant from scanning their own QR
    if (qr.merchantId.toString() === customerId) {
      await QRRedemption.findByIdAndUpdate(qr._id, { $set: { status: 'pending' } });
      return res.status(400).json({ success: false, message: 'You cannot redeem your own QR code' });
    }

    const { cashbackCoins, cashbackMAD } = qr;

    // Deduct from offer's remaining budget
    const updatedOffer = await Offer.findOneAndUpdate(
      { _id: qr.offerId, remainingWinCoinsBudget: { $gte: cashbackCoins } },
      { $inc: { remainingWinCoinsBudget: -cashbackCoins } },
      { new: true }
    );

    if (!updatedOffer) {
      await QRRedemption.findByIdAndUpdate(qr._id, { $set: { status: 'pending' } });
      return res.status(400).json({ success: false, message: 'Offer budget insufficient for this redemption' });
    }

    // Auto-close offer if budget can't cover another redemption
    const nextCostPerRedemption = updatedOffer.price * updatedOffer.cashbackPercent / 100 / 10;
    if (updatedOffer.remainingWinCoinsBudget < nextCostPerRedemption) {
      await Offer.findByIdAndUpdate(updatedOffer._id, { $set: { isActive: false } });
      logActivity('info', { userId: customerId, action: 'offer.autoClose', status: 'success', message: `Offer ${updatedOffer._id} auto-closed after redemption` });
    }

    // Credit customer's wallet
    await User.findByIdAndUpdate(
      customerId,
      { $inc: { winCoinsBalance: cashbackCoins } }
    );

    // Mark QR as redeemed
    await QRRedemption.findByIdAndUpdate(qr._id, {
      $set: {
        status: 'redeemed',
        customerId,
        redeemedAt: new Date(),
      }
    });

    // Create cashback transaction record
    const transaction = await Transaction.create({
      userId: customerId,
      type: 'cashback',
      amount: cashbackCoins,
      amountMAD: cashbackMAD,
      description: `Cashback: ${qr.snapshotItemName} at ${updatedOffer.establishmentName} (${qr.snapshotCashbackPercent}% of ${qr.snapshotPrice} MAD)`,
      offerId: qr.offerId,
      qrRedemptionId: qr._id,
      status: 'completed'
    });

    logActivity('info', { userId: customerId, action: 'qr.redeem', status: 'success', message: `Redeemed QR ${qr.token.substring(0, 12)}... → ${cashbackCoins} WinCoins (${cashbackMAD} MAD)` });

    res.status(200).json({
      success: true,
      transaction,
      cashback: {
        coins: cashbackCoins,
        mad: cashbackMAD,
        itemName: qr.snapshotItemName,
        establishmentName: updatedOffer.establishmentName,
      }
    });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'qr.redeem', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error redeeming QR code', error: error.message });
  }
};

// --- MERCHANT VIEWS THEIR QR REDEMPTION HISTORY ---
export const getMerchantRedemptions = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const redemptions = await QRRedemption.find({ merchantId })
      .populate('customerId', 'firstName lastName email')
      .populate('offerId', 'itemName establishmentName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, redemptions });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'qr.merchantHistory', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching redemption history', error: error.message });
  }
};

// --- CUSTOMER VIEWS THEIR CASHBACK HISTORY ---
export const getMyRedemptions = async (req, res) => {
  try {
    const customerId = req.auth.userId;
    const redemptions = await QRRedemption.find({ customerId, status: 'redeemed' })
      .populate('offerId', 'itemName establishmentName price cashbackPercent')
      .sort({ redeemedAt: -1 });

    res.status(200).json({ success: true, redemptions });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'qr.customerHistory', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching cashback history', error: error.message });
  }
};
