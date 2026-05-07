import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

// --- MERCHANT PAYS INFLUENCER ---
export const payInfluencer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { influencerId, amount, description, offerId } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }

    // 1. Verify merchant has enough balance
    const merchant = await User.findById(merchantId);
    if (!merchant || merchant.winCoinsBalance < amount) {
      logActivity('warn', { userId: merchantId, action: 'transaction.pay', status: 'failed', message: `Insufficient balance (Requested: ${amount}, Balance: ${merchant?.winCoinsBalance})` });
      return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance to pay the influencer.' });
    }

    // 2. Deduct from merchant
    await User.findByIdAndUpdate(
      merchantId,
      { $inc: { winCoinsBalance: -amount } }
    );

    // 3. Add to influencer
    await User.findByIdAndUpdate(
      influencerId,
      { $inc: { winCoinsBalance: amount } }
    );

    // 4. Record the transaction history for the influencer
    const transaction = await Transaction.create({
      userId: influencerId,
      type: 'gain',
      amount,
      description: description || `Payment received from merchant`,
      offerId,
      status: 'completed'
    });

    logActivity('info', { userId: merchantId, action: 'transaction.pay', status: 'success', message: `Merchant paid ${amount} WinCoins to influencer ${influencerId}` });
    res.status(200).json({ success: true, transaction });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'transaction.pay', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error processing payment', error: error.message });
  }
};

// --- ADMIN TOPS UP MERCHANT ---
export const adminTopUp = async (req, res) => {
  try {
    const { merchantId, amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }

    // 1. Add to merchant balance
    const merchant = await User.findByIdAndUpdate(
      merchantId,
      { $inc: { winCoinsBalance: amount } },
      { new: true }
    );

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    // 2. Record the transaction history for the merchant
    const transaction = await Transaction.create({
      userId: merchantId,
      type: 'gain',
      amount,
      description: 'Admin Top Up (Purchased WinCoins)',
      status: 'completed'
    });

    logActivity('info', { userId: req.auth.userId, action: 'transaction.topUp', status: 'success', message: `Admin topped up ${amount} WinCoins for merchant ${merchantId}` });
    res.status(200).json({ success: true, transaction, newBalance: merchant.winCoinsBalance });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'transaction.topUp', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error processing top up', error: error.message });
  }
};

// --- INFLUENCER/MERCHANT WITHDRAWS WINCOINS ---
export const createWithdrawTransaction = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    if (amount < 20) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is 20 WinCoins' });
    }

    if (!['paypal', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method. Choose paypal or bank.' });
    }

    if (!paymentDetails || paymentDetails.trim() === '') {
      return res.status(400).json({ success: false, message: 'Payment details (email or RIB) are required.' });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (!user || user.winCoinsBalance < amount) {
      logActivity('warn', { userId, action: 'transaction.withdraw', status: 'failed', message: `Insufficient balance (Requested: ${amount}, Balance: ${user?.winCoinsBalance})` });
      return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance' });
    }

    const transaction = await Transaction.create({
      userId,
      type: 'retrait',
      amount,
      description: `Withdrawal via ${paymentMethod}`,
      status: 'pending', // Withdrawals usually pend until admin approves
      paymentMethod,
      paymentDetails
    });

    // Deduct from user balance
    await User.findByIdAndUpdate(
      userId,
      { $inc: { winCoinsBalance: -amount } }
    );

    logActivity('info', { userId, action: 'transaction.withdraw', status: 'success', message: `Requested withdrawal of ${amount} WinCoins` });
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'transaction.withdraw', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error processing withdrawal', error: error.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'transaction.getAll', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching transactions', error: error.message });
  }
};

export const getMyBalance = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId).select('winCoinsBalance');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, balance: user.winCoinsBalance });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'transaction.getBalance', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching balance', error: error.message });
  }
};
