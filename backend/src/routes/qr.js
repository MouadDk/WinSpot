import { Router } from 'express';
import { requireAuthentication, requireRole } from '../middleware/auth.js';
import {
  generateQR,
  listMerchantQRs,
  scanQR,
  listInfluencerPendingQRs,
} from '../controllers/qrController.js';

const router = Router();

// Merchant: generate a new QR token for an offer
router.post('/generate', requireRole('merchant'), generateQR);

// Merchant: list all QR codes they generated
router.get('/mine', requireRole('merchant'), listMerchantQRs);

// Influencer: scan a QR token (creates pending transaction)
router.post('/scan', requireAuthentication(), scanQR);

// Influencer: list their pending QR-based transactions
router.get('/pending', requireAuthentication(), listInfluencerPendingQRs);

export default router;
