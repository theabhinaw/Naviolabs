import mongoose from 'mongoose';

// Keep this list in sync with SERVICE_OPTIONS in client/src/data/content.js
export const SERVICES = [
  'Workflow automation',
  'AI integration',
  'AI agent or chatbot',
  'Web development',
  'Not sure yet',
];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    service: { type: String, required: true, enum: SERVICES },
    message: { type: String, required: true, trim: true, maxlength: 2000 },

    // Result of forwarding this lead to the Google Sheets webhook
    sheetStatus: { type: String, enum: ['pending', 'sent', 'failed', 'skipped'], default: 'pending' },
    sheetError: { type: String, default: '' },

    // Basic technical info, useful to spot spam
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ email: 1 });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
