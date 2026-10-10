import express from 'express';
import { sendEmailAnnouncement, updateEmployeeCard, getIdCardData } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only routes
router.post('/send-email', protect, authorize('admin'), sendEmailAnnouncement);
router.put('/employee-card/:id', protect, authorize('admin'), updateEmployeeCard);

// Public route: anyone with the link can view the ID card
router.get('/id-card/:id', getIdCardData);

export default router;
