import { Lead } from '../models/Lead.js';
import { isDbReady } from '../config/db.js';
import { sendToGoogleSheet } from '../services/googleSheets.js';

const SUCCESS_MESSAGE = 'Thank you! Your audit request is received, we will contact you shortly.';

/**
 * POST /api/leads
 * 1. Save the lead in MongoDB.
 * 2. Forward the same lead to the Google Sheets webhook.
 * The request succeeds when at least one of the two worked, so a lead is not lost
 * if only one system is down.
 */
export async function createLead(req, res, next) {
  try {
    const data = req.validated;

    let lead = null;
    if (isDbReady()) {
      try {
        lead = await Lead.create({
          ...data,
          ip: req.ip || '',
          userAgent: (req.get('user-agent') || '').slice(0, 300),
        });
      } catch (err) {
        console.error('[leads] MongoDB save failed:', err.message);
      }
    } else {
      console.warn('[leads] MongoDB is not connected, skipping the database save');
    }

    const sheet = await sendToGoogleSheet(data);
    if (!sheet.ok && !sheet.skipped) {
      console.error('[leads] Google Sheets webhook failed:', sheet.error);
    }

    if (lead) {
      lead.sheetStatus = sheet.ok ? 'sent' : sheet.skipped ? 'skipped' : 'failed';
      lead.sheetError = sheet.ok ? '' : sheet.error || '';
      await lead.save().catch((err) => console.error('[leads] Could not update sheetStatus:', err.message));
    }

    const saved = Boolean(lead);
    if (!saved && !sheet.ok) {
      return res.status(502).json({
        success: false,
        message: 'We could not record your request right now. Please try again in a minute, or message us on WhatsApp.',
      });
    }

    return res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGE,
      saved,
      sheetSynced: sheet.ok,
    });
  } catch (err) {
    return next(err);
  }
}
