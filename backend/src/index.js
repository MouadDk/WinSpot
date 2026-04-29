import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/winspot';

async function main() {
  await connectDatabase(mongoUri); // ❌ removed try/catch — let it fail loudly
  console.log('✅ Connected to MongoDB');

  const app = createApp();
  app.listen(port, () => {
    console.log(`🚀 Backend listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});