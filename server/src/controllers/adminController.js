import { User } from '../models/User.js';
import nodemailer from 'nodemailer';

export async function sendEmailAnnouncement(req, res, next) {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const users = await User.find({}).select('email'); // Send to all users
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found to email.' });
    }

    const emails = users.map(u => u.email);

    // If SMTP is not configured, we'll log it successfully as a mock
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('--- MOCK EMAIL SENT ---');
      console.log('To:', emails.length, 'users');
      console.log('Subject:', subject);
      console.log('Message:', message);
      console.log('Note: Configure SMTP_USER and SMTP_PASS in your Render Environment Variables to send real emails.');
      return res.status(200).json({ 
        success: true, 
        message: `Simulated sending to ${emails.length} users. (SMTP not configured in Env variables yet)` 
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
      bcc: emails, // Use BCC for privacy
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
    res.status(500).json({ success: false, message: 'Failed to send emails. Ensure SMTP is correct.' });
  }
}
