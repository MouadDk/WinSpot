import Offer from '../models/Offer.js';
import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

const normalizeOfferInput = (body = {}) => {
  const normalized = { ...body };

  if (normalized.winCoinsPerPublication !== undefined) {
    normalized.winCoinsReward = normalized.winCoinsPerPublication;
    delete normalized.winCoinsPerPublication;
  }

  if (normalized.totalWinCoinsBudget !== undefined) {
    normalized.totalWinCoinsBudget = Number(normalized.totalWinCoinsBudget);
  }

  if (normalized.remainingWinCoinsBudget !== undefined) {
    normalized.remainingWinCoinsBudget = Number(normalized.remainingWinCoinsBudget);
  }

  return normalized;
};

const serializeOffer = (offerDoc) => {
  const offer = offerDoc.toObject ? offerDoc.toObject() : offerDoc;
  const winCoinsPerPublication = offer.winCoinsPerPublication ?? offer.winCoinsReward;
  const totalWinCoinsBudget = offer.totalWinCoinsBudget ?? winCoinsPerPublication;
  const remainingWinCoinsBudget = offer.remainingWinCoinsBudget ?? totalWinCoinsBudget;

  return {
    ...offer,
    winCoinsPerPublication,
    totalWinCoinsBudget,
    remainingWinCoinsBudget,
  };
};

const computeRemainingFromTotal = (offer, requestedTotal) => {
  const previousTotal = Number(offer.totalWinCoinsBudget ?? offer.winCoinsReward ?? 0);
  const previousRemaining = Number(offer.remainingWinCoinsBudget ?? previousTotal);
  const spent = Math.max(previousTotal - previousRemaining, 0);
  return requestedTotal - spent;
};

export const createOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const normalizedInput = normalizeOfferInput(req.body);
    const totalBudget = Number(normalizedInput.totalWinCoinsBudget);
    const rewardPerPublication = Number(normalizedInput.winCoinsReward);

    if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
      logActivity('warn', { userId: merchantId, action: 'offer.create.validation', status: 'failed', message: `Invalid total budget: ${normalizedInput.totalWinCoinsBudget}` });
      return res.status(400).json({ success: false, message: 'Total WinCoins budget must be greater than 0' });
    }

    if (!Number.isFinite(rewardPerPublication) || rewardPerPublication <= 0) {
      logActivity('warn', { userId: merchantId, action: 'offer.create.validation', status: 'failed', message: `Invalid per-publication reward: ${normalizedInput.winCoinsReward}` });
      return res.status(400).json({ success: false, message: 'WinCoins per publication must be greater than 0' });
    }

    if (totalBudget < rewardPerPublication) {
      logActivity('warn', { userId: merchantId, action: 'offer.create.validation', status: 'failed', message: `Budget ${totalBudget} is lower than reward ${rewardPerPublication}` });
      return res.status(400).json({ success: false, message: 'Total WinCoins budget must be at least one publication reward' });
    }

    const merchant = await User.findById(merchantId).select('winCoinsBalance');
    if (!merchant) {
      logActivity('warn', { userId: merchantId, action: 'offer.create.validation', status: 'failed', message: 'Merchant record not found' });
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    if (merchant.winCoinsBalance < totalBudget) {
      logActivity('warn', { userId: merchantId, action: 'offer.create.balanceCheck', status: 'failed', message: `Insufficient balance (Required: ${totalBudget}, Available: ${merchant.winCoinsBalance})` });
      return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance to start this offer' });
    }

    await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: -totalBudget } });
    logActivity('info', { userId: merchantId, action: 'offer.budget.reserve', status: 'success', message: `Reserved ${totalBudget} WinCoins for new offer` });

    const offerData = {
      ...normalizedInput,
      merchantId,
      totalWinCoinsBudget: totalBudget,
      remainingWinCoinsBudget: totalBudget,
      isActive: true,
    };
    
    let offer;
    try {
      offer = await Offer.create(offerData);
    } catch (createError) {
      await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: totalBudget } });
      logActivity('warn', { userId: merchantId, action: 'offer.budget.reserveRollback', status: 'success', message: `Offer creation failed, refunded reserved ${totalBudget} WinCoins` });
      throw createError;
    }

    logActivity('info', { userId: merchantId, action: 'offer.create', status: 'success', message: `Offer created: ${offer._id} (Budget: ${totalBudget}, Reward: ${rewardPerPublication})` });
    res.status(201).json({ success: true, offer: serializeOffer(offer) });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.create', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error creating offer', error: error.message });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers: offers.map(serializeOffer) });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getAll', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching offers', error: error.message });
  }
};

export const getMerchantOffers = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const offers = await Offer.find({ merchantId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers: offers.map(serializeOffer) });
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
    res.status(200).json({ success: true, offer: serializeOffer(offer) });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getById', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching offer', error: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;
    const normalizedInput = normalizeOfferInput(req.body);

    const currentOffer = await Offer.findOne({ _id: id, merchantId });
    if (!currentOffer) {
      logActivity('warn', { userId: merchantId, action: 'offer.update', status: 'failed', message: `Unauthorized or not found: ${id}` });
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

    const updatePayload = { ...normalizedInput };
    const currentTotalBudget = Number(currentOffer.totalWinCoinsBudget ?? currentOffer.winCoinsReward ?? 0);
    const nextTotalBudget = updatePayload.totalWinCoinsBudget !== undefined
      ? Number(updatePayload.totalWinCoinsBudget)
      : currentTotalBudget;

    if (!Number.isFinite(nextTotalBudget) || nextTotalBudget <= 0) {
      logActivity('warn', { userId: merchantId, action: 'offer.update.validation', status: 'failed', message: `Invalid total budget: ${updatePayload.totalWinCoinsBudget}` });
      return res.status(400).json({ success: false, message: 'Total WinCoins budget must be greater than 0' });
    }

    if (updatePayload.winCoinsReward !== undefined) {
      const nextReward = Number(updatePayload.winCoinsReward);
      if (!Number.isFinite(nextReward) || nextReward <= 0) {
        logActivity('warn', { userId: merchantId, action: 'offer.update.validation', status: 'failed', message: `Invalid per-publication reward: ${updatePayload.winCoinsReward}` });
        return res.status(400).json({ success: false, message: 'WinCoins per publication must be greater than 0' });
      }
      if (nextTotalBudget < nextReward) {
        logActivity('warn', { userId: merchantId, action: 'offer.update.validation', status: 'failed', message: `Budget ${nextTotalBudget} is lower than reward ${nextReward}` });
        return res.status(400).json({ success: false, message: 'Total WinCoins budget must be at least one publication reward' });
      }
    }

    const computedRemaining = computeRemainingFromTotal(currentOffer, nextTotalBudget);
    if (computedRemaining < 0) {
      logActivity('warn', { userId: merchantId, action: 'offer.update.validation', status: 'failed', message: `Requested budget ${nextTotalBudget} is lower than already spent amount` });
      return res.status(400).json({ success: false, message: 'Total WinCoins budget cannot be less than already spent amount' });
    }

    const budgetDelta = nextTotalBudget - currentTotalBudget;
    if (budgetDelta > 0) {
      const merchant = await User.findById(merchantId).select('winCoinsBalance');
      if (!merchant || merchant.winCoinsBalance < budgetDelta) {
        logActivity('warn', { userId: merchantId, action: 'offer.update.balanceCheck', status: 'failed', message: `Insufficient balance to increase budget (Delta: ${budgetDelta}, Available: ${merchant?.winCoinsBalance ?? 0})` });
        return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance to increase this offer budget' });
      }
      await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: -budgetDelta } });
      logActivity('info', { userId: merchantId, action: 'offer.budget.increase', status: 'success', message: `Reserved additional ${budgetDelta} WinCoins for offer ${id}` });
    } else if (budgetDelta < 0) {
      await User.findByIdAndUpdate(merchantId, { $inc: { winCoinsBalance: Math.abs(budgetDelta) } });
      logActivity('info', { userId: merchantId, action: 'offer.budget.decrease', status: 'success', message: `Refunded ${Math.abs(budgetDelta)} WinCoins from offer ${id}` });
    }

    updatePayload.totalWinCoinsBudget = nextTotalBudget;
    updatePayload.remainingWinCoinsBudget = computedRemaining;

    const nextReward = Number(updatePayload.winCoinsReward ?? currentOffer.winCoinsReward);
    if (!updatePayload.isActive && updatePayload.isActive !== undefined) {
      // Merchant can manually pause regardless of remaining budget.
    } else if (computedRemaining < nextReward) {
      updatePayload.isActive = false;
      logActivity('info', { userId: merchantId, action: 'offer.autoClose', status: 'success', message: `Offer ${id} auto-closed during update (Remaining: ${computedRemaining}, Reward: ${nextReward})` });
    }

    const offer = await Offer.findOneAndUpdate(
      { _id: id, merchantId },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    logActivity('info', { userId: merchantId, action: 'offer.update', status: 'success', message: `Offer updated: ${id}` });
    res.status(200).json({ success: true, offer: serializeOffer(offer) });
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
      logActivity('warn', { userId: merchantId, action: 'offer.delete', status: 'failed', message: `Unauthorized or not found: ${id}` });
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

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
