import { Router } from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { adminLogin, requireAdminAuth } from '../middleware/adminAuth.js';
import { adminTopUp } from '../controllers/transactionController.js';

const router = Router();

// Public: Admin Login — validates email + password, returns a JWT
router.post('/login', adminLogin);

// All routes below require a valid admin JWT
router.use(requireAdminAuth);

// Get all merchants
router.get('/merchants', async (req, res) => {
  try {
    const merchants = await User.find({ role: 'merchant' }).sort({ createdAt: -1 });
    res.json({ success: true, merchants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all influencers
router.get('/influencers', async (req, res) => {
  try {
    const influencers = await User.find({ role: 'influencer' }).sort({ createdAt: -1 });
    res.json({ success: true, influencers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totals] = await User.aggregate([
      {
        $group: {
          _id: null,
          circulatingWinCoins: { $sum: { $ifNull: ['$winCoinsBalance', 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        circulatingWinCoins: totals?.circulatingWinCoins ?? 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a user (Merchant or Influencer)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Also delete their transactions, offers, and missions if needed
    // (For MVP, just deleting the user is enough, or we can add logic here later)
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Top Up Route (reuses the existing controller)
router.post('/topup', adminTopUp);

// --- CASHOUT MANAGEMENT ---
// Get pending withdrawals
router.get('/withdrawals/pending', async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'retrait', status: 'pending' })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: 1 });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve withdrawal
router.post('/withdrawals/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction || transaction.type !== 'retrait' || transaction.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Pending withdrawal not found' });
    }

    transaction.status = 'completed';
    await transaction.save();
    
    res.json({ success: true, message: 'Withdrawal approved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject withdrawal
router.post('/withdrawals/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction || transaction.type !== 'retrait' || transaction.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Pending withdrawal not found' });
    }

    // Mark as failed
    transaction.status = 'failed';
    await transaction.save();

    // Refund WinCoins to the user
    await User.findByIdAndUpdate(
      transaction.userId,
      { $inc: { winCoinsBalance: transaction.amount } }
    );
    
    res.json({ success: true, message: 'Withdrawal rejected and WinCoins refunded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
