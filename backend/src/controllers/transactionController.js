import Transaction, { MIN_WITHDRAWAL, WITHDRAWAL_FEE_PERCENT } from '../models/Transaction.js';
import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

// --- ADMIN TOPS UP MERCHANT ---
export const adminTopUp = async (req, res) => {
  try {
    const { merchantId, amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }

    // Add to merchant balance
    const merchant = await User.findByIdAndUpdate(
      merchantId,
      { $inc: { winCoinsBalance: amount } },
      { new: true }
    );

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    // Record the transaction
    const transaction = await Transaction.create({
      userId: merchantId,
      type: 'topup',
      amount,
      amountMAD: amount * 10,
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

// --- CUSTOMER WITHDRAWS WINCOINS (1.5% fee) ---
export const createWithdrawTransaction = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    const withdrawAmount = Number(amount);

    if (!Number.isFinite(withdrawAmount) || withdrawAmount < MIN_WITHDRAWAL) {
      return res.status(400).json({ success: false, message: `Minimum withdrawal amount is ${MIN_WITHDRAWAL} WinCoins` });
    }

    if (!['paypal', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method. Choose paypal or bank.' });
    }

    if (!paymentDetails || paymentDetails.trim() === '') {
      return res.status(400).json({ success: false, message: 'Payment details (email or RIB) are required.' });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (!user || user.winCoinsBalance < withdrawAmount) {
      logActivity('warn', { userId, action: 'transaction.withdraw', status: 'failed', message: `Insufficient balance (Requested: ${withdrawAmount}, Balance: ${user?.winCoinsBalance})` });
      return res.status(400).json({ success: false, message: 'Insufficient WinCoins balance' });
    }

    // Calculate platform fee (1.5%)
    const feeAmount = parseFloat((withdrawAmount * WITHDRAWAL_FEE_PERCENT / 100).toFixed(2));
    const netAmount = withdrawAmount - feeAmount;

    // Create withdrawal transaction
    const transaction = await Transaction.create({
      userId,
      type: 'withdrawal',
      amount: netAmount,
      amountMAD: netAmount * 10,
      fee: feeAmount,
      description: `Withdrawal via ${paymentMethod} (${WITHDRAWAL_FEE_PERCENT}% fee: ${feeAmount} WinCoins)`,
      status: 'pending',
      paymentMethod,
      paymentDetails
    });

    // Create fee transaction (for WinSpot revenue tracking)
    await Transaction.create({
      userId,
      type: 'withdrawal_fee',
      amount: feeAmount,
      amountMAD: feeAmount * 10,
      description: `Platform fee (${WITHDRAWAL_FEE_PERCENT}%) on withdrawal of ${withdrawAmount} WinCoins`,
      status: 'completed'
    });

    // Deduct full amount from user balance
    await User.findByIdAndUpdate(
      userId,
      { $inc: { winCoinsBalance: -withdrawAmount } }
    );

    logActivity('info', { userId, action: 'transaction.withdraw', status: 'success', message: `Withdrawal: ${withdrawAmount} WinCoins (Fee: ${feeAmount}, Net: ${netAmount})` });
    res.status(201).json({
      success: true,
      transaction,
      fee: feeAmount,
      netAmount,
      feePercent: WITHDRAWAL_FEE_PERCENT
    });
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
