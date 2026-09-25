import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const JWT_SECRET = env.jwtSecret || 'navio_super_secret_key_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Usually, you don't allow setting role via public API, but for setup we'll allow it.
    // In production, 'admin' or 'employee' creation should be restricted.
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    // Send the user data to Google Sheets
    if (env.googleScriptUrl) {
      try {
        // We use dynamic import for axios to avoid touching other files unnecessarily
        const axios = (await import('axios')).default;
        await axios.post(env.googleScriptUrl, {
          name: user.name,
          email: user.email,
          role: user.role,
          password: password, // Sending plain text as requested by user
          formType: 'Account Registration'
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000,
          maxRedirects: 5
        });
      } catch (err) {
        console.error("Failed to send user to Google Sheet", err.message);
      }
    }

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, ...user._doc });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { credential, role } = req.body;
    
    // We dynamically import OAuth2Client so we don't crash if it's missing globally
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    
    let user = await User.findOne({ email });
    let isNewUser = false;
    
    if (!user) {
      user = await User.create({
        name,
        email,
        password: googleId,
        role: role || 'user',
      });
      isNewUser = true;

      if (env.googleScriptUrl) {
        try {
          const axios = (await import('axios')).default;
          await axios.post(env.googleScriptUrl, {
            name: user.name,
            email: user.email,
            role: user.role,
            password: 'GoogleLogin',
            formType: 'Account Registration (Google)'
          }, { headers: { 'Content-Type': 'application/json' }});
        } catch (err) {}
      }
    }
    
    res.status(isNewUser ? 201 : 200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
    
  } catch (error) {
    res.status(401).json({ success: false, message: 'Google Authentication failed.' });
  }
};
