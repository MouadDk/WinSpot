import { requireAuth } from '@clerk/express';
import { logActivity } from '../config/logger.js';

/**
 * Middleware that ensures the user is authenticated via Clerk.
 * Attaches req.auth.userId which is used to link with MongoDB.
 * Use this on any route that needs a logged-in user but no specific role.
 */
export const requireAuthentication = () => {
  return [
    requireAuth(),
    (req, res, next) => {
      if (!req.auth?.userId) {
        logActivity('warn', {
          action: 'auth.check',
          status: 'denied',
          message: 'No userId in session'
        });
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required. Please sign in.',
        });
      }
      next();
    }
  ];
};

/**
 * Middleware factory to enforce strict Role-Based Access Control.
 * @param {string} allowedRole - 'merchant' or 'influencer'
 * @returns {Array<Function>} - Express middleware chain
 */
export const requireRole = (allowedRole) => {
  return [
    // 1. First, ensure the user has a valid Clerk session token
    requireAuth(),
    
    // 2. Second, verify the user's role metadata
    (req, res, next) => {
      // The Clerk middleware attaches `req.auth` to the request
      const sessionClaims = req.auth?.sessionClaims;
      const userId = req.auth?.userId;
      
      // Extract the role from the unsafe_metadata we set during sign up
      const userRole = sessionClaims?.unsafe_metadata?.role;

      if (!userRole) {
        logActivity('warn', {
          clerkId: userId,
          action: 'auth.roleCheck',
          status: 'denied',
          message: `No role assigned — required: ${allowedRole}`
        });
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No role assigned to this user account.',
        });
      }

      if (userRole !== allowedRole) {
        logActivity('warn', {
          clerkId: userId,
          action: 'auth.roleCheck',
          status: 'denied',
          message: `Role mismatch — has: ${userRole}, required: ${allowedRole}`
        });
        return res.status(403).json({
          error: 'Forbidden',
          message: `Access denied. This endpoint requires '${allowedRole}' role, but user has '${userRole}' role.`,
        });
      }

      // If they passed both checks, proceed to the controller
      next();
    }
  ];
};
