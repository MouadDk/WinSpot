import mongoose from 'mongoose';
import dns from 'node:dns';

export async function connectDatabase(uri) {
  // Fix for "querySrv ECONNREFUSED" on some Windows/Node.js configurations
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}