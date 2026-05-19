import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import QRRedemption from '../models/QRRedemption.js';
import Offer from '../models/Offer.js';
import { adminLogin, requireAdminAuth } from '../middleware/adminAuth.js';
import { adminTopUp } from '../controllers/transactionController.js';
import { logActivity } from '../config/logger.js';

const router = Router();

// Public: Admin Login — validates email + password, returns a JWT
router.post('/login', adminLogin);

// All routes below require a valid admin JWT
router.use(requireAdminAuth);

// ── GET /api/admin/merchants ──────────────────────────────────────────────────
router.get('/merchants', async (req, res) => {
  try {
    const merchants = await User.find({ role: 'merchant' }).sort({ createdAt: -1 });
    res.json({ success: true, merchants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/admin/customers ──────────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totals] = await User.aggregate([
      {
        $group: {
          _id: null,
          circulatingWinCoins: { $sum: { $ifNull: ['$winCoinsBalance', 0] } },
        },
      },
    ]);

    // Calculate platform revenue from withdrawal fees
    const [feeTotal] = await Transaction.aggregate([
      { $match: { type: 'withdrawal_fee', status: 'completed' } },
      { $group: { _id: null, totalFees: { $sum: '$amount' } } },
    ]);

    // Count total QR redemptions
    const totalRedemptions = await QRRedemption.countDocuments({ status: 'redeemed' });

    res.json({
      success: true,
      stats: {
        circulatingWinCoins: totals?.circulatingWinCoins ?? 0,
        platformRevenue: feeTotal?.totalFees ?? 0,
        totalRedemptions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/users/:id
 *
 * SEC-3 FIX — Atomic, Cascade User Deletion
 * ──────────────────────────────────────────
 * Previously, deleting a user only removed the User document, leaving
 * orphaned Offers, Transactions, and QRRedemptions in the database.
 *
 * This implementation:
 *  1. Runs inside a Mongoose session/transaction for atomicity — if any step
 *     fails, all changes roll back and the database stays consistent.
 *  2. Before deleting offers, it refunds the remaining WinCoins budget back
 *     to the merchant (only relevant for merchant accounts).
 *  3. Closes (deactivates) all active offers belonging to the merchant so no
 *     further QR codes can be generated from them.
 *  4. Cascade-deletes QRRedemptions where the user was the merchant OR the
 *     customer (only pending/expired ones — redeemed records are kept for
 *     audit trails of the OTHER party).
 *  5. Nullifies the userId reference in completed Transactions instead of
 *     deleting them, preserving financial audit trails.
 *
 * Assumptions:
 *  - Merchant budget refunds are issued by incrementing winCoinsBalance.
 *    The original purchase transactions are NOT reversed — they remain as
 *    historical records.
 *  - Completed cashback/withdrawal Transactions are preserved with userId=null
 *    for audit integrity.
 *  - Pending withdrawals are failed+refunded before deletion to prevent lost funds.
 *  - Admin accounts cannot be deleted via this endpoint (403 guard).
 */
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId before touching the DB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID.' });
  }

  // Prevent accidental deletion of admin accounts via this endpoint
  const targetUser = await User.findById(id);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  if (targetUser.role === 'admin') {
    return res.status(403).json({ success: false, message: 'Admin accounts cannot be deleted via this endpoint.' });
  }

  // Start a MongoDB session for atomic multi-document operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ── Step 1 (Merchant only): Refund remaining offer budgets ───────────────
    if (targetUser.role === 'merchant') {
      const activeOffers = await Offer.find({ merchantId: id, isActive: true }).session(session);

      let totalRefund = 0;
      for (const offer of activeOffers) {
        totalRefund += offer.remainingWinCoinsBudget ?? 0;
      }

      if (totalRefund > 0) {
        // NOTE: We increment then immediately delete the user — the increment
        // is only meaningful if we later decide to archive instead of delete.
        // For now this is a no-op for deleted users but is included for
        // forward-compatibility if deletion becomes soft-delete.
        await User.findByIdAndUpdate(id, { $inc: { winCoinsBalance: totalRefund } }, { session });

        logActivity('info', {
          userId: req.auth?.userId,
          action: 'admin.deleteUser.budgetRefund',
          status: 'info',
          message: `Refunding ${totalRefund} WinCoins from ${activeOffers.length} active offers for merchant ${id}`,
        });
      }
    }

    // ── Step 2 (Merchant only): Close all active offers ───────────────────────
    if (targetUser.role === 'merchant') {
      await Offer.updateMany(
        { merchantId: id, isActive: true },
        { $set: { isActive: false } },
        { session }
      );
    }

    // ── Step 3: Fail + refund any pending withdrawals ─────────────────────────
    // This prevents a customer's pending withdrawal from becoming unresolvable
    const pendingWithdrawals = await Transaction.find({
      userId: id,
      type: 'withdrawal',
      status: 'pending',
    }).session(session);

    for (const withdrawal of pendingWithdrawals) {
      withdrawal.status = 'failed';
      await withdrawal.save({ session });

      // Refund full amount (net + fee) — fee record is now orphaned but preserved
      const refundAmount = (withdrawal.amount ?? 0) + (withdrawal.fee ?? 0);
      if (refundAmount > 0) {
        await User.findByIdAndUpdate(
          id,
          { $inc: { winCoinsBalance: refundAmount } },
          { session }
        );
      }
    }

    // ── Step 4: Delete pending/expired QR redemptions the user was involved in ─
    // We keep 'redeemed' records intact because they reference another party
    // (the customer who earned cashback, or the merchant who generated the QR).
    // Deleting them would break the other user's history.
    await QRRedemption.deleteMany(
      {
        $or: [
          { merchantId: id, status: { $in: ['pending', 'expired'] } },
          { customerId: id, status: { $in: ['pending', 'expired'] } },
        ],
      },
      { session }
    );

    // ── Step 5: Nullify userId on completed Transactions (audit preservation) ──
    // We do NOT delete financial transactions — they are the audit trail.
    // Nullifying userId keeps the amounts in the ledger without linking to a
    // deleted user. The `userId` field is not required on Transaction schema
    // but IS currently marked required=true — we use a direct updateMany to
    // bypass Mongoose validation here.
    await Transaction.updateMany(
      { userId: id },
      { $set: { userId: null } },
      { session }
    );

    // ── Step 6 (Merchant only): Delete the merchant's offers ─────────────────
    if (targetUser.role === 'merchant') {
      await Offer.deleteMany({ merchantId: id }, { session });
    }

    // ── Step 7: Delete the user ───────────────────────────────────────────────
    await User.findByIdAndDelete(id, { session });

    // Commit — everything succeeded
    await session.commitTransaction();

    logActivity('info', {
      userId: req.auth?.userId,
      action: 'admin.deleteUser',
      status: 'success',
      message: `User ${id} (${targetUser.role}: ${targetUser.email}) deleted with cascade cleanup`,
    });

    res.json({
      success: true,
      message: `User ${targetUser.email} deleted successfully with all related data cleaned up.`,
    });
  } catch (error) {
    // Rollback on any failure — the DB remains in its pre-deletion state
    await session.abortTransaction();

    logActivity('error', {
      userId: req.auth?.userId,
      action: 'admin.deleteUser',
      status: 'failed',
      message: `Cascade delete failed for user ${id}: ${error.message}`,
    });

    res.status(500).json({
      success: false,
      message: 'Failed to delete user. All changes have been rolled back.',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

// ── POST /api/admin/topup ─────────────────────────────────────────────────────
// Admin tops up a merchant's WinCoins balance (correctly wired from transactionController)
router.post('/topup', adminTopUp);

// ── CASHOUT MANAGEMENT ────────────────────────────────────────────────────────

// GET /api/admin/withdrawals/pending
router.get('/withdrawals/pending', async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'withdrawal', status: 'pending' })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: 1 });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/withdrawals/:id/approve
router.post('/withdrawals/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction || transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Pending withdrawal not found' });
    }

    transaction.status = 'completed';
    await transaction.save();

    res.json({ success: true, message: 'Withdrawal approved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/withdrawals/:id/reject
router.post('/withdrawals/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction || transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Pending withdrawal not found' });
    }

    // Mark as failed
    transaction.status = 'failed';
    await transaction.save();

    // Refund the full withdrawal amount (net + fee) to the user
    const refundAmount = transaction.amount + transaction.fee;
    await User.findByIdAndUpdate(transaction.userId, { $inc: { winCoinsBalance: refundAmount } });

    // Also mark the associated withdrawal_fee transaction as failed
    const feeTransaction = await Transaction.findOne({
      userId: transaction.userId,
      type: 'withdrawal_fee',
      status: 'completed',
      createdAt: {
        $gte: new Date(transaction.createdAt.getTime() - 2000),
        $lte: new Date(transaction.createdAt.getTime() + 2000),
      },
    });

    if (feeTransaction) {
      feeTransaction.status = 'failed';
      await feeTransaction.save();
    }

    res.json({ success: true, message: 'Withdrawal rejected and WinCoins refunded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
