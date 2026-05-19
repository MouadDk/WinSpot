import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { logActivity } from '../config/logger.js';

// ── Environment guards ────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * SEC-2: GOOGLE_CLIENT_ID is required for server-side token verification.
 * Add GOOGLE_CLIENT_ID=<your-client-id> to your backend .env file.
 * This MUST match the client ID used in the frontend Google OAuth initialisation.
 */
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('FATAL: GOOGLE_CLIENT_ID environment variable is not set. Google OAuth cannot work.');
}
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Shared helper: build and sign a WinSpot JWT ───────────────────────────────
const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

// ── Shared helper: public user shape returned to clients ──────────────────────
const publicUser = (user) => ({
  id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  winCoinsBalance: user.winCoinsBalance,
});

// ── POST /api/auth/register ───────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, category } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
      role: ['merchant', 'customer'].includes(role) ? role : 'customer',
      category: role === 'merchant' ? category : null,
    });

    logActivity('info', {
      userId: user._id.toString(),
      action: 'auth.register',
      status: 'success',
      message: `User registered: ${normalizedEmail}`,
    });

    res.status(201).json({ success: true, message: 'Inscription réussie. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    logActivity('error', { action: 'auth.register', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: "Erreur lors de l'inscription.", error: error.message });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    // Google-only account — no password set
    if (!user.password) {
      return res.status(400).json({ success: false, message: 'Please login with Google.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    const token = signToken(user);

    logActivity('info', {
      userId: user._id.toString(),
      action: 'auth.login',
      status: 'success',
      message: `User logged in: ${normalizedEmail}`,
    });

    res.status(200).json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    logActivity('error', { action: 'auth.login', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion.', error: error.message });
  }
};

/**
 * POST /api/auth/google
 *
 * SEC-2 FIX — Server-Side Google Token Verification
 * ──────────────────────────────────────────────────
 * Previously the frontend decoded the JWT client-side and sent plain-text
 * { email, firstName, googleId } which any attacker could forge.
 *
 * Now:
 *  1. Frontend sends ONLY the raw `credential` string returned by Google.
 *  2. We verify it via OAuth2Client.verifyIdToken() which:
 *       a. Validates the RS256 signature against Google's public keys.
 *       b. Checks `iss` (must be accounts.google.com).
 *       c. Checks `aud` (must match GOOGLE_CLIENT_ID).
 *       d. Checks token expiry.
 *  3. We ONLY extract user data from the verified payload — never from the request body.
 *  4. We also enforce that `email_verified === true` (Google can return unverified emails
 *     for some legacy OAuth flows).
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID — must match the client ID configured in the frontend
 */
export const googleCallback = async (req, res) => {
  try {
    const { credential } = req.body;

    // 1. Credential must be present
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing Google credential token.',
      });
    }

    // 2. Verify the token server-side — this throws if invalid/expired/tampered
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      // Log the verify error at warn level (could be an attack probe)
      logActivity('warn', {
        action: 'auth.google_verify',
        status: 'rejected',
        message: `Invalid Google token: ${verifyError.message}`,
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Google token. Please sign in again.',
      });
    }

    // 3. Enforce email_verified (Google marks some accounts as unverified)
    if (!payload.email_verified) {
      logActivity('warn', {
        action: 'auth.google_verify',
        status: 'rejected',
        message: `Google email not verified: ${payload.email}`,
      });
      return res.status(401).json({
        success: false,
        message: 'Your Google account email is not verified. Please verify it first.',
      });
    }

    // 4. Extract identity ONLY from the verified payload (never from req.body)
    const normalizedEmail = payload.email.toLowerCase().trim();
    const googleId = payload.sub;            // Subject = stable Google user ID
    const firstName = payload.given_name || '';
    const lastName = payload.family_name || '';

    // 5. Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // New user — register via Google
      user = await User.create({
        email: normalizedEmail,
        firstName,
        lastName,
        googleId,
        role: 'customer',
        password: '', // No password for Google OAuth users
      });
      logActivity('info', {
        userId: user._id.toString(),
        action: 'auth.google_register',
        status: 'success',
        message: `User registered via Google: ${normalizedEmail}`,
      });
    } else if (!user.googleId) {
      // Existing email/password account — link Google ID
      user.googleId = googleId;
      await user.save();
      logActivity('info', {
        userId: user._id.toString(),
        action: 'auth.google_link',
        status: 'success',
        message: `Google account linked to existing user: ${normalizedEmail}`,
      });
    }

    // 6. Issue WinSpot JWT
    const token = signToken(user);

    logActivity('info', {
      userId: user._id.toString(),
      action: 'auth.google_login',
      status: 'success',
      message: `User logged in via Google: ${normalizedEmail}`,
    });

    res.status(200).json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    logActivity('error', { action: 'auth.google_login', status: 'failed', message: error.message });
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion avec Google.',
      error: error.message,
    });
  }
};
