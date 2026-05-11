import jwt from 'jsonwebtoken';
import { logActivity } from '../config/logger.js';

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Admin login handler — validates email + password, returns a short-lived JWT.
 * Replaces the old pattern of storing the raw password in localStorage.
 */
export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  const expectedSecret = process.env.ADMIN_SECRET;
  const allowedEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  // Check email against backend whitelist
  if (allowedEmails.length > 0 && !allowedEmails.includes(email.toLowerCase().trim())) {
    logActivity('warn', { action: 'admin.login', status: 'denied', message: `Unauthorized admin email: ${email}` });
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  // Check password against ADMIN_SECRET
  if (password !== expectedSecret) {
    logActivity('warn', { action: 'admin.login', status: 'denied', message: 'Invalid admin password attempt' });
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  // Issue a short-lived admin JWT (4 hours)
  const adminToken = jwt.sign(
    { userId: 'admin_local', role: 'admin', email: email.toLowerCase().trim() },
    JWT_SECRET,
    { expiresIn: '4h' }
  );

  logActivity('info', { action: 'admin.login', status: 'success', message: `Admin logged in: ${email}` });
  res.status(200).json({ success: true, message: 'Admin authenticated', token: adminToken });
};

/**
 * Middleware — verifies an admin JWT from the Authorization: Bearer header.
 * Replaces the old pattern of sending the raw x-admin-secret on every request.
 */
export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin token is missing.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not an admin token.' });
    }

    // Inject admin auth so existing controllers work
    req.auth = {
      userId: decoded.userId,
      role: 'admin',
      sessionClaims: { unsafe_metadata: { role: 'admin' } }
    };
    next();
  } catch (error) {
    logActivity('warn', { action: 'admin.auth', status: 'denied', message: error.message });
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token.' });
  }
};
