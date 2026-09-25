import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProd } from './config/env.js';
import { isDbReady } from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);

  // Security headers. The policy allows what the website needs:
  // Pyodide (Python in the browser) from jsDelivr, Google Fonts, and the Google Sheets webhook.
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "'unsafe-eval'", "'wasm-unsafe-eval'", 'https://cdn.jsdelivr.net'],
          'worker-src': ["'self'", 'blob:'],
          'connect-src': [
            "'self'",
            'https://cdn.jsdelivr.net',
            'https://script.google.com',
            'https://script.googleusercontent.com',
          ],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
          'img-src': ["'self'", 'data:', 'blob:'],
          // Hosting platforms already serve the site over HTTPS. Removing this keeps http://localhost working.
          'upgrade-insecure-requests': null,
        },
      },
    })
  );

  // CORS is enforced by browsers: we only add the headers for the origins we trust.
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || env.clientOrigins.includes(origin)),
      methods: ['GET', 'POST'],
    })
  );

  app.use(express.json({ limit: '20kb' }));
  if (!isProd) app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({
      ok: true,
      database: isDbReady(),
      googleSheets: Boolean(env.googleScriptUrl),
      time: new Date().toISOString(),
    });
  });

  app.use('/api/leads', leadRoutes);
  app.use('/api/auth', authRouter);
  app.use('/api', notFound);

  // Optional: serve the built React app from the same server.
  if (env.serveClient) {
    if (fs.existsSync(clientDist)) {
      app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
      app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
    } else {
      console.warn(`[server] SERVE_CLIENT is on but ${clientDist} was not found. Run "npm run build" first.`);
    }
  }

  app.use(errorHandler);
  return app;
}
