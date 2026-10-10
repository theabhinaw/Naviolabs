import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://theabhinawpatel6_db_user:1ONhk6C7zVM1bdqC@cluster0.1prew3i.mongodb.net/?appName=Cluster0';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const email = 'admin@naviolabs.com';
    const password = 'AdminPassword123!';

    // Check if exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin already exists. Resetting password...');
      user.password = password;
      await user.save();
      console.log('Password reset successfully.');
    } else {
      user = await User.create({
        name: 'Super Admin',
        email,
        password,
        role: 'admin'
      });
      console.log('Admin created successfully.');
    }

    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
