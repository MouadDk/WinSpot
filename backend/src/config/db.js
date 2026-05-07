import mongoose from 'mongoose';
import dns from 'node:dns';

// The 'export' keyword here makes this a named export
export async function connectDatabase(uri) {
  // Fix for "querySrv ECONNREFUSED" on some Windows/Node.js configurations
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  const dbName = process.env.MONGODB_DB_NAME ?? 'pub2win';
  const appName = process.env.MONGODB_APP_NAME ?? 'Pub2Win';
  
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName, appName });
}