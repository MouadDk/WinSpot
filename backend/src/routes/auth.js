import express from 'express';
import { register, login, googleCallback } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * SEC-4 FIX: Auth endpoints now rate-limited at 20 req / 15 min per IP.
 * This prevents brute-force attacks on login and registration spam.
 */

// POST /api/auth/register
router.post('/register', authLimiter, register);

// POST /api/auth/login
router.post('/login', authLimiter, login);

// POST /api/auth/google  — SEC-2: backend verifies the raw credential token
router.post('/google', authLimiter, googleCallback);

export default router;
