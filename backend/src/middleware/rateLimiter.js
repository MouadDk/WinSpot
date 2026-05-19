/**
 * rateLimiter.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Centralised rate-limiting middleware using `express-rate-limit`.
 *
 * SECURITY NOTE (SEC-4):
 *   - Limits are applied per IP to prevent anonymous abuse.
 *   - The `keyGenerator` falls back to `req.ip` so that authenticated requests
 *     still hit the same bucket (IP-based, not JWT-based) – this means a shared
 *     NAT/proxy would count multiple users together, which is acceptable for the
 *     current scale.  Switch to a Redis store + user-ID key for production at
 *     scale.
 *
 * Tiers:
 *   authLimiter      – login / register endpoints   (moderate)
 *   qrGenerateLimiter – merchant QR generation       (moderate)
 *   qrRedeemLimiter  – customer QR redemption        (strict – abuse target)
 */

import rateLimit from 'express-rate-limit';

// Helper: builds a clean JSON response when a limit is exceeded
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests. Please wait a moment and try again.',
    retryAfter: Math.ceil(res.getHeader('Retry-After') ?? 60),
  });
};

// ── AUTH endpoints: login, register, google callback ─────────────────────────
// 20 requests per 15 minutes per IP – enough for normal usage, blocks brute-force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true, // Return `RateLimit-*` headers (RFC 6585)
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: 'Too many authentication attempts.',
  skipSuccessfulRequests: false, // Count every request (not just failures)
});

// ── QR generation: merchant side ─────────────────────────────────────────────
// 60 per 10 minutes per IP – generous for a busy restaurant at lunch rush
export const qrGenerateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: 'QR generation limit reached. Please wait before generating more QR codes.',
});

// ── QR redemption: customer side ─────────────────────────────────────────────
// 15 per 10 minutes per IP – strict because this credits real WinCoins
// An honest customer scans once per meal; 15 gives plenty of legitimate headroom
export const qrRedeemLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  message: 'Redemption limit reached. Please wait before trying again.',
});
