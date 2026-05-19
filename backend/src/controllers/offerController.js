import Offer from '../models/Offer.js';
import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

export const createOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { establishmentName, category, itemName, description, price, cashbackPercent, totalWinCoinsBudget, location } = req.body;

    const priceNum = Number(price);
    const cashbackNum = Number(cashbackPercent);
    const budgetNum = Number(totalWinCoinsBudget);

    if (!itemName || !itemName.trim()) {
      return res.status(400).json({ success: false, message: 'Item name is required' });
    }

    if (!Number.isFinite(priceNum) || priceNum < 1) {
      return res.status(400).json({ success: false, message: 'Price must be at least 1 MAD' });
    }

    if (!Number.isFinite(cashbackNum) || cashbackNum < 1 || cashbackNum > 50) {
      return res.status(400).json({ success: false, message: 'Cashback must be between 1% and 50%' });
    }

    if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
      return res.status(400).json({ success: false, message: 'Total WinCoins budget must be greater than 0' });
    }

    // Calculate how many WinCoins one redemption costs (1 WinCoin = 10 MAD)
    const cashbackPerRedemption = priceNum * cashbackNum / 100 / 10;
    if (budgetNum < cashbackPerRedemption) {
      return res.status(400).json({ success: false, message: `Budget must cover at least one redemption (${cashbackPerRedemption.toFixed(2)} WinCoins needed)` });
    }

    // Check merchant has enough balance
    const merchant = await User.findById(merchantId).select('winCoinsBalance');
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    if (merchant.winCoinsBalance < budgetNum) {
      logActivity('warn', { userId: merchantId, action: 'offer.create.balanceCheck', status: 'failed', message: `Insufficient balance (Required: ${budgetNum}, Available: ${merchant.winCoinsBalance})` });
      return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance to start this offer' });
    }

    // Reserve budget from merchant's balance
    await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: -budgetNum } });
    logActivity('info', { userId: merchantId, action: 'offer.budget.reserve', status: 'success', message: `Reserved ${budgetNum} WinCoins for new offer` });

    const offerData = {
      merchantId,
      establishmentName,
      category,
      itemName: itemName.trim(),
      description: description || '',
      price: priceNum,
      cashbackPercent: cashbackNum,
      totalWinCoinsBudget: budgetNum,
      remainingWinCoinsBudget: budgetNum,
      location: location || { type: 'Point', coordinates: [0, 0] },
      isActive: true,
    };

    let offer;
    try {
      offer = await Offer.create(offerData);
    } catch (createError) {
      // Rollback budget reservation
      await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: budgetNum } });
      logActivity('warn', { userId: merchantId, action: 'offer.budget.reserveRollback', status: 'success', message: `Offer creation failed, refunded reserved ${budgetNum} WinCoins` });
      throw createError;
    }

    logActivity('info', { userId: merchantId, action: 'offer.create', status: 'success', message: `Offer created: ${offer._id} (${itemName}, ${priceNum} MAD, ${cashbackNum}% cashback, Budget: ${budgetNum})` });
    res.status(201).json({ success: true, offer });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.create', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error creating offer', error: error.message });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getAll', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching offers', error: error.message });
  }
};

export const getMerchantOffers = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const offers = await Offer.find({ merchantId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getMerchant', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching merchant offers', error: error.message });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, offer });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getById', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching offer', error: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;

    const currentOffer = await Offer.findOne({ _id: id, merchantId });
    if (!currentOffer) {
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

    const updatePayload = {};
    const allowedFields = ['establishmentName', 'category', 'itemName', 'description', 'price', 'cashbackPercent', 'totalWinCoinsBudget', 'location', 'isActive', 'expiresAt'];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updatePayload[key] = req.body[key];
      }
    }

    // Handle budget changes
    const currentTotalBudget = Number(currentOffer.totalWinCoinsBudget);
    const nextTotalBudget = updatePayload.totalWinCoinsBudget !== undefined
      ? Number(updatePayload.totalWinCoinsBudget)
      : currentTotalBudget;

    if (updatePayload.totalWinCoinsBudget !== undefined) {
      if (!Number.isFinite(nextTotalBudget) || nextTotalBudget <= 0) {
        return res.status(400).json({ success: false, message: 'Total WinCoins budget must be greater than 0' });
      }

      const currentRemaining = Number(currentOffer.remainingWinCoinsBudget);
      const spent = Math.max(currentTotalBudget - currentRemaining, 0);
      const newRemaining = nextTotalBudget - spent;

      if (newRemaining < 0) {
        return res.status(400).json({ success: false, message: 'Budget cannot be less than already spent amount' });
      }

      const budgetDelta = nextTotalBudget - currentTotalBudget;
      if (budgetDelta > 0) {
        const merchant = await User.findById(merchantId).select('winCoinsBalance');
        if (!merchant || merchant.winCoinsBalance < budgetDelta) {
          return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance to increase this offer budget' });
        }
        await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: -budgetDelta } });
        logActivity('info', { userId: merchantId, action: 'offer.budget.increase', status: 'success', message: `Reserved additional ${budgetDelta} WinCoins for offer ${id}` });
      } else if (budgetDelta < 0) {
        await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: Math.abs(budgetDelta) } });
        logActivity('info', { userId: merchantId, action: 'offer.budget.decrease', status: 'success', message: `Refunded ${Math.abs(budgetDelta)} WinCoins from offer ${id}` });
      }

      updatePayload.totalWinCoinsBudget = nextTotalBudget;
      updatePayload.remainingWinCoinsBudget = newRemaining;

      // Auto-close if remaining budget can't cover one redemption
      const nextPrice = Number(updatePayload.price ?? currentOffer.price);
      const nextCashback = Number(updatePayload.cashbackPercent ?? currentOffer.cashbackPercent);
      const costPerRedemption = nextPrice * nextCashback / 100 / 10;
      if (newRemaining < costPerRedemption) {
        updatePayload.isActive = false;
        logActivity('info', { userId: merchantId, action: 'offer.autoClose', status: 'success', message: `Offer ${id} auto-closed (Remaining: ${newRemaining}, Cost: ${costPerRedemption})` });
      }
    }

    const offer = await Offer.findOneAndUpdate(
      { _id: id, merchantId },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    logActivity('info', { userId: merchantId, action: 'offer.update', status: 'success', message: `Offer updated: ${id}` });
    res.status(200).json({ success: true, offer });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.update', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error updating offer', error: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;

    const offer = await Offer.findOneAndDelete({ _id: id, merchantId });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

    // Refund remaining budget
    const remainingBudget = Number(offer.remainingWinCoinsBudget ?? 0);
    if (remainingBudget > 0) {
      await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: remainingBudget } });
      logActivity('info', { userId: merchantId, action: 'offer.budget.refund', status: 'success', message: `Refunded remaining ${remainingBudget} WinCoins from deleted offer ${id}` });
    }

    logActivity('info', { userId: merchantId, action: 'offer.delete', status: 'success', message: `Offer deleted: ${id}` });
    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.delete', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error deleting offer', error: error.message });
  }
};
