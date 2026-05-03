import express from 'express';
import cors from 'cors';

// Note: In ES Modules, you MUST include the .js extension in local imports
import clerkWebhookRoute from './routes/clerkWebhook.js';
import healthRoute from './routes/health.js';
import protectedRoutes from './routes/protected.js';
import { clerkMiddleware } from '@clerk/express';

export function createApp() {
  const app = express();

  // 1. CORS
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

  // 2. Webhooks (MUST be before express.json)
  app.use('/api/webhooks', clerkWebhookRoute);

  // 3. Body Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 4. Global Auth Middleware
  // Protects everything BELOW this line.
  // Note: Webhooks are ABOVE this line because they don't use session tokens.
  app.use(clerkMiddleware());

  // 5. Routes
  app.use('/api/health', healthRoute);
  app.use('/api', protectedRoutes);

  // 6. Error Handling
  app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  });

  return app;
}