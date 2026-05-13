import express from 'express';
import cors from 'cors';
import path from 'path';

import healthRoute from './routes/health.js';
import protectedRoutes from './routes/protected.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import offersRoutes from './routes/offers.js';
import transactionsRoutes from './routes/transactions.js';
import usersRoutes from './routes/users.js';
import missionsRoutes from './routes/missions.js';
import qrRoutes from './routes/qr.js';
import aiRoutes from './routes/aiRoutes.js'; // <-- 1. ADD THIS IMPORT
import { logActivity } from './config/logger.js';

export function createApp() {
  const app = express();

  // 1. CORS
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
  }));

  // 2. Body Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. Public Routes
  app.use('/api/health', healthRoute);
  app.use('/api/auth', authRoutes);

  // 4. Protected Routes
  app.use('/api', protectedRoutes);
  
  // 5. Admin Routes
  app.use('/api/admin', adminRoutes);

  // 6. Offer Routes
  app.use('/api/offers', offersRoutes);

  // 7. Transaction Routes
  app.use('/api/transactions', transactionsRoutes);

  // 8. User Routes
  app.use('/api/users', usersRoutes);

  // 9. Mission Routes
  app.use('/api/missions', missionsRoutes);

  // 10. QR Visit Routes
  app.use('/api/qr', qrRoutes);

  // 11. AI Analysis Routes <-- 2. ADD THIS MOUNT POINT
  app.use('/api/ai', aiRoutes);

  // Serve uploads folder so admin can view uploaded AI images
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // 12. Error Handling (Updated comment number)
  app.use((err, req, res, next) => {
    const userId = req.auth?.userId;
    logActivity('error', {
      userId: userId || 'unknown',
      action: 'server.error',
      status: 'failed',
      message: err.message || 'Unknown server error'
    });
    res.status(500).json({ success: false, message: 'Server error' });
  });

  return app;
}