import mongoose from 'mongoose';
import { env } from './env.js';

// Fail fast instead of waiting 10 seconds when the database is down.
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', true);

let retryTimer = null;

export async function connectDB() {
  if (!env.mongoUri) {
    console.warn('[db] MONGODB_URI is not set. Leads will only be sent to Google Sheets.');
    return false;
  }
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[db] MongoDB connected');
    if (retryTimer) { clearInterval(retryTimer); retryTimer = null; }
    return true;
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    scheduleRetry();
    return false;
  }
}

function scheduleRetry() {
  if (retryTimer) return; // already scheduled
  console.log('[db] Will retry MongoDB connection every 30 seconds...');
  retryTimer = setInterval(async () => {
    if (isDbReady()) { clearInterval(retryTimer); retryTimer = null; return; }
    try {
      await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
      console.log('[db] MongoDB connected (on retry)');
      clearInterval(retryTimer);
      retryTimer = null;
    } catch (err) {
      console.error('[db] MongoDB retry failed:', err.message);
    }
  }, 30000);
  retryTimer.unref(); // don't block process exit
}

// Reconnect automatically if connection drops mid-session
mongoose.connection.on('disconnected', () => {
  console.warn('[db] MongoDB disconnected');
  scheduleRetry();
});

export const isDbReady = () => mongoose.connection.readyState === 1;
