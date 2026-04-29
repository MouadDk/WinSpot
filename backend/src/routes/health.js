import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.json({
    ok: true,
    service: 'WinSpot API',
    timestamp: new Date().toISOString()
  });
});