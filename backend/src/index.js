import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { logActivity } from './config/logger.js';

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/winspot';

async function main() {
  await connectDatabase(mongoUri);

  logActivity('info', {
    action: 'server.startup',
    status: 'success',
    message: 'Connected to MongoDB'
  });

  const app = createApp();
  app.listen(port, () => {
    logActivity('info', {
      action: 'server.startup',
      status: 'success',
      message: `Backend listening on http://localhost:${port}`
    });
    console.log(`🚀 Backend listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  logActivity('error', {
    action: 'server.startup',
    status: 'failed',
    message: `Failed to start backend: ${error.message}`
  });
  console.error('Failed to start backend', error);
  process.exit(1);
});