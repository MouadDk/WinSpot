import { requireAuth } from '@clerk/express';

/**
 * Middleware factory to enforce strict Role-Based Access Control.
 * @param {string} allowedRole - 'restaurant' or 'influencer'
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
      
      // Extract the role from the unsafe_metadata we set during sign up
      const userRole = sessionClaims?.unsafe_metadata?.role;

      if (!userRole) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No role assigned to this user account.',
        });
      }

      if (userRole !== allowedRole) {
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
