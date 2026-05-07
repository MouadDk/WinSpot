import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';
import { 
  getCurrentUserProfile, 
  updateCurrentUserProfile, 
  getUserProfileById 
} from '../controllers/userController.js';

const router = Router();

// Routes for /api/users
router.get('/me', requireAuthentication(), getCurrentUserProfile);
router.put('/me', requireAuthentication(), updateCurrentUserProfile);
router.get('/:id', requireAuthentication(), getUserProfileById);

export default router;
