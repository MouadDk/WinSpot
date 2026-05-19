
import { Router } from 'express';
import { requireAuthentication } from '../middleware/auth.js';

const router = Router();

// ─── COMMON AUTHENTICATED ROUTES ─────────────────────────────
// Any authenticated user can access these (no specific role required)

router.get('/me', requireAuthentication(), async (req, res) => {
  // Returns the current user's ID for lookups
  res.json({
    message: 'Authenticated',
    userId: req.auth.userId
  });
});

export default router;
