export const requireHardcodedAdmin = (req, res, next) => {
  // We expect the frontend to send the password in the x-admin-secret header
  const adminSecret = req.headers['x-admin-secret'];
  
  // For the MVP, we use the exact password requested by the user
  const expectedPassword = process.env.ADMIN_SECRET || 'Mouad123$';

  if (adminSecret && adminSecret === expectedPassword) {
    // Inject a fake admin auth object so existing controllers that rely on req.auth don't crash
    req.auth = { 
      userId: 'admin_local', 
      sessionClaims: { unsafe_metadata: { role: 'admin' } } 
    };
    return next();
  }
  
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};
