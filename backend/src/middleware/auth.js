import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_pub2win_2026';

export const requireAuthentication = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Token manquant ou invalide.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.auth = decoded;
      next();
    } catch (error) {
      logActivity('warn', { action: 'auth.check', status: 'denied', message: error.message });
      return res.status(401).json({ error: 'Unauthorized', message: 'Session expirée ou token invalide.' });
    }
  };
};

export const requireRole = (allowedRole) => {
  return [
    requireAuthentication(),
    async (req, res, next) => {
      try {
        const userId = req.auth.userId;
        const userRole = req.auth.role;

        // Verify user still exists in DB
        const dbUser = await User.findById(userId);

        if (!dbUser) {
          logActivity('warn', { userId, action: 'auth.roleCheck', status: 'denied', message: 'User not found in MongoDB' });
          return res.status(403).json({ error: 'Forbidden', message: 'Utilisateur introuvable.' });
        }

        if (userRole !== allowedRole) {
          logActivity('warn', {
            userId,
            action: 'auth.roleCheck',
            status: 'denied',
            message: `Role mismatch — has: ${userRole}, required: ${allowedRole}`
          });
          return res.status(403).json({
            error: 'Forbidden',
            message: `Accès refusé. Le rôle '${allowedRole}' est requis.`,
          });
        }

        next();
      } catch (error) {
        logActivity('error', { action: 'auth.roleCheck', status: 'failed', message: error.message });
        return res.status(500).json({ success: false, message: 'Erreur de vérification des droits.' });
      }
    }
  ];
};
