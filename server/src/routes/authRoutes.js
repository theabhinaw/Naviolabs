import express from 'express';
import { registerUser, loginUser, getMe, getAllUsers, googleLogin } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/google', googleLogin);
authRouter.get('/me', protect, getMe);

// Admin only route to get all users
authRouter.get('/users', protect, authorize('admin'), getAllUsers);
