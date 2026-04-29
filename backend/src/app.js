import cors from 'cors';
import express from 'express';
import { healthRouter } from './routes/health.js';
import { clerkWebhookRouter } from './routes/clerkWebhook.js';

export function createApp() {
  const app = express();

  app.use(cors());

  // Clerk webhooks require raw body for Svix signature verification.
  app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));
  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({ message: 'WinSpot API is running' });
  });

  app.use('/health', healthRouter);
  app.use('/api/webhooks/clerk', clerkWebhookRouter);

  return app;
}