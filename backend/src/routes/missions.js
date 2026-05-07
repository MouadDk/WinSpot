import { Router } from 'express';
import { requireAuthentication, requireRole } from '../middleware/auth.js';
import { 
  createMission, 
  getMissions, 
  getMissionById, 
  updateMissionStatus, 
  assignInfluencer,
  deleteMission
} from '../controllers/missionController.js';

const router = Router();

// Get missions relevant to the logged-in user
router.get('/', requireAuthentication(), getMissions);
router.get('/:id', requireAuthentication(), getMissionById);

// Influencer routes
router.post('/:id/assign', requireRole('influencer'), assignInfluencer);

// Merchant only routes
router.post('/', requireRole('merchant'), createMission);
router.put('/:id', requireRole('merchant'), updateMissionStatus);
router.delete('/:id', requireRole('merchant'), deleteMission);

export default router;
