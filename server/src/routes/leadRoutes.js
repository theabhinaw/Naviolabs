import { Router } from 'express';
import { createLead } from '../controllers/leadController.js';
import { validateLead } from '../middleware/validateLead.js';
import { honeypot } from '../middleware/honeypot.js';
import { leadLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/', leadLimiter, honeypot, validateLead, createLead);

export default router;
