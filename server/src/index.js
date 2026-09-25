import mongoose from 'mongoose';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});

async function start() {
  await connectDB();
  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(`[server] Navio Labs API is running on http://localhost:${env.port} (${env.nodeEnv})`);
    if (!env.googleScriptUrl) {
      console.warn('[server] GOOGLE_SCRIPT_URL is not set. Leads will not be sent to Google Sheets.');
    }
  });

  const shutdown = (signal) => {
    console.log(`\n[server] ${signal} received. Shutting down...`);
    server.close(async () => {
      await mongoose.connection.close().catch(() => {});
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
