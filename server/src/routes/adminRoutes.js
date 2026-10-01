import express from 'express';
import { sendEmailAnnouncement } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-email', protect, authorize('admin'), sendEmailAnnouncement);

export default router;
