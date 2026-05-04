
import { Router } from 'express';
import { requireRole, requireAuthentication } from '../middleware/auth.js';

const router = Router();

// ─── MERCHANT PROTECTED ROUTES ──────────────────────────────
// Only users with unsafeMetadata.role === 'merchant' can access these

router.get('/merchant/test', requireRole('merchant'), (req, res) => {
  res.json({
    message: 'Success! You have accessed a Merchant-only endpoint.',
    userId: req.auth.userId,
    role: req.auth.sessionClaims.unsafe_metadata.role
  });
});

router.get('/merchant/campaigns', requireRole('merchant'), (req, res) => {
  // Example: Fetch campaigns for this specific merchant from MongoDB
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

// ─── COMMON AUTHENTICATED ROUTES ─────────────────────────────
// Any authenticated user can access these (no specific role required)

router.get('/me', requireAuthentication(), async (req, res) => {
  // Returns the current user's Clerk ID for MongoDB lookups
  res.json({
    message: 'Authenticated',
    userId: req.auth.userId
  });
});

export default router;
