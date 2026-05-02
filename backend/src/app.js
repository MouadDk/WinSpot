import express from 'express';
import cors from 'cors';

// Note: In ES Modules, you MUST include the .js extension in local imports
import clerkWebhookRoute from './routes/clerkWebhook.js';
import healthRoute from './routes/health.js';

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

  // 4. Routes
  app.use('/api/health', healthRoute);

  // 5. Error Handling
  app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  });

  return app;
}