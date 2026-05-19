import { Router } from 'express';
import { requireAuthentication, requireRole } from '../middleware/auth.js';
import { generateQR, redeemQR, getMerchantRedemptions, getMyRedemptions } from '../controllers/qrController.js';
import { qrGenerateLimiter, qrRedeemLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * SEC-4 FIX: QR endpoints are now rate-limited.
 *
 *   POST /api/qr/generate — 60 req / 10 min per IP (moderate, merchant traffic)
 *   POST /api/qr/redeem  — 15 req / 10 min per IP (strict, financial operation)
 *
 * Rate limiters are applied BEFORE role middleware so over-limit requests are
 * rejected early without touching the database.
 */

// Merchant/waiter generates a QR code for an offer
router.post('/generate', qrGenerateLimiter, requireRole('merchant'), generateQR);

// Customer redeems a QR token
router.post('/redeem', qrRedeemLimiter, requireRole('customer'), redeemQR);

// Merchant views their redemption history
router.get('/merchant/history', requireRole('merchant'), getMerchantRedemptions);

// Customer views their cashback history
router.get('/my/history', requireRole('customer'), getMyRedemptions);

export default router;
