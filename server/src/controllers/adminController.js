import { User } from '../models/User.js';
import nodemailer from 'nodemailer';

// Send email announcement to all users
export async function sendEmailAnnouncement(req, res, next) {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const users = await User.find({}).select('email');
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found to email.' });
    }

    const emails = users.map(u => u.email);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('--- MOCK EMAIL SENT ---');
      console.log('To:', emails.length, 'users');
      console.log('Subject:', subject);
      console.log('Message:', message);
      return res.status(200).json({ 
        success: true, 
        message: `Simulated sending to ${emails.length} users. (SMTP not configured)` 
      });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      bcc: emails,
      subject: subject,
      text: message,
      html: `<div style="font-family: sans-serif; padding: 20px;">
               <h2 style="color: #060C1C;">Navio Labs Update</h2>
               <p style="white-space: pre-wrap; color: #333; line-height: 1.6;">${message}</p>
             </div>`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: `Announcement sent to ${emails.length} users successfully.` });

  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails.' });
  }
}

// Upload/Update employee photo & designation
export async function updateEmployeeCard(req, res) {
  try {
    const { id } = req.params;
    const { photo, designation } = req.body;

    const update = {};
    if (photo !== undefined) update.photo = photo;
    if (designation !== undefined) update.designation = designation;

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Update employee card error:', error);
    res.status(500).json({ success: false, message: 'Failed to update employee.' });
  }
}

// Public endpoint: Get employee ID card data by user ID
export async function getIdCardData(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name email role photo designation createdAt');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.json({
      success: true,
      employee: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        designation: user.designation || (user.role === 'admin' ? 'Executive Admin' : 'Team Member'),
        joinedDate: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employee data.' });
  }
}
