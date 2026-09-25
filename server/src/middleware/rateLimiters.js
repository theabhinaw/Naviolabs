import rateLimit from 'express-rate-limit';

// At most 10 audit requests per 15 minutes from one address.
export const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this connection. Please try again in a few minutes.',
  },
});
