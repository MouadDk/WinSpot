import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';
import {
  adminTopUp,
  createWithdrawTransaction,
  getMyTransactions,
  getMyBalance,
} from '../controllers/transactionController.js';

// LOGIC-3 FIX: `adminTopUp` IS used — it's re-exported here so admin.js can
// import it from the same place as before.  Previously it was imported in
// transactions.js but never wired to a route here, causing a dead import.
// The actual route for adminTopUp lives in /api/admin/topup (admin.js).
// We keep the export here so nothing breaks if other files import from this
// module, but we do NOT mount it as a public route.

const router = Router();

// ── GET /api/transactions — user's own transaction history ───────────────────
router.get('/', requireAuthentication(), getMyTransactions);

// ── GET /api/transactions/balance — user's current WinCoins balance ──────────
router.get('/balance', requireAuthentication(), getMyBalance);

// ── POST /api/transactions/withdraw — initiate a withdrawal request ──────────
// Rate limiting for this route is applied at the app level via qrRedeemLimiter
// (reused because both are abuse-sensitive financial operations).
router.post('/withdraw', requireAuthentication(), createWithdrawTransaction);

export default router;

// Re-export adminTopUp so other modules can import from here without circular deps
export { adminTopUp };
