
import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// ─── RESTAURANT PROTECTED ROUTES ──────────────────────────────
// Only users with unsafeMetadata.role === 'restaurant' can access these

router.get('/restaurant/test', requireRole('restaurant'), (req, res) => {
  res.json({
    message: 'Success! You have accessed a Restaurant-only endpoint.',
    userId: req.auth.userId,
    role: req.auth.sessionClaims.unsafe_metadata.role
  });
});

router.get('/restaurant/campaigns', requireRole('restaurant'), (req, res) => {
  // Example: Fetch campaigns for this specific restaurant from MongoDB
  res.json({ data: 'Mock campaign data for ' + req.auth.userId });
});

// ─── INFLUENCER PROTECTED ROUTES ──────────────────────────────
// Only users with unsafeMetadata.role === 'influencer' can access these

router.get('/influencer/test', requireRole('influencer'), (req, res) => {
  res.json({
    message: 'Success! You have accessed an Influencer-only endpoint.',
    userId: req.auth.userId,
    role: req.auth.sessionClaims.unsafe_metadata.role
  });
});

router.get('/influencer/tasks', requireRole('influencer'), (req, res) => {
  // Example: Fetch available tasks from MongoDB
  res.json({ data: 'Mock task data for ' + req.auth.userId });
});

export default router;
