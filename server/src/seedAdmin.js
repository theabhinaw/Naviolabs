import mongoose from 'mongoose';
import { env } from './config/env.js';
import { User } from './models/User.js';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('Connected!');

    const email = 'naviolabs'; // You requested 'naviolabs' as username, we will use it in the email field for login
    
    // Check if admin exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      console.log('Admin already exists! Updating password just in case...');
      adminExists.password = 'naviolabs123';
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin updated successfully!');
    } else {
      console.log('Creating new admin...');
      await User.create({
        name: 'Administrator',
        email: email,
        password: 'naviolabs123',
        role: 'admin'
      });
      console.log('Admin created successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
