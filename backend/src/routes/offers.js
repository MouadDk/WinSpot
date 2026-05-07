import { Router } from 'express';
import { requireAuthentication, requireRole } from '../middleware/auth.js';
import { 
  createOffer, 
  getAllOffers, 
  getOfferById, 
  updateOffer, 
  deleteOffer 
} from '../controllers/offerController.js';

const router = Router();

// Routes for /api/offers
router.get('/', requireAuthentication(), getAllOffers);
router.get('/:id', requireAuthentication(), getOfferById);

// Merchant only routes
router.post('/', requireRole('merchant'), createOffer);
router.put('/:id', requireRole('merchant'), updateOffer);
router.delete('/:id', requireRole('merchant'), deleteOffer);

export default router;
