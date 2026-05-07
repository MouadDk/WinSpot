import { Router } from 'express';
import { requireAuthentication, requireRole } from '../middleware/auth.js';
import { 
  payInfluencer,
  adminTopUp,
  createWithdrawTransaction, 
  getMyTransactions, 
  getMyBalance 
} from '../controllers/transactionController.js';

const router = Router();

// Routes for /api/transactions
router.get('/', requireAuthentication(), getMyTransactions);
router.get('/balance', requireAuthentication(), getMyBalance);

// Withdrawals
router.post('/withdraw', requireAuthentication(), createWithdrawTransaction);

// Merchant pays influencer
router.post('/pay', requireRole('merchant'), payInfluencer);

// Admin tops up merchant's WinCoins
router.post('/topup', requireRole('admin'), adminTopUp);

export default router;
