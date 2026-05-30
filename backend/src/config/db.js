import mongoose from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const dnsServers = env.mongoDnsServers
      .split(',')
      .map((server) => server.trim())
      .filter(Boolean);

    if (env.mongoUri.startsWith('mongodb+srv://') && dnsServers.length > 0) {
      dns.setServers(dnsServers);
    }

    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
