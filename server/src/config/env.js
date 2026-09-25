import 'dotenv/config';

const toBool = (value, fallback = false) => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toProxy = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  if (/^\d+$/.test(value)) return Number(value);
  return toBool(value, fallback);
};

const nodeEnv = process.env.NODE_ENV || 'development';

export const isProd = nodeEnv === 'production';

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  serveClient: toBool(process.env.SERVE_CLIENT, isProd),
  trustProxy: toProxy(process.env.TRUST_PROXY, isProd ? 1 : false),
  mongoUri: process.env.MONGODB_URI || '',
  googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || '',
  googleScriptUrlAudit: process.env.GOOGLE_SCRIPT_URL_AUDIT || '',
  webhookTimeoutMs: Number(process.env.WEBHOOK_TIMEOUT_MS) || 10000,
};
