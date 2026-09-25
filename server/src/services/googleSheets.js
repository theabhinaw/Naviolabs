import axios from 'axios';
import { env } from '../config/env.js';

const FIELDS = ['name', 'email', 'phone', 'service', 'message'];

// Spreadsheets treat text starting with = + - @ as a formula. A leading apostrophe keeps it as plain text.
const neutralizeFormula = (value) => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

export function toSheetPayload(lead) {
  const payload = { formType: 'Workflow Audit' };
  for (const field of FIELDS) {
    payload[field] = neutralizeFormula(String(lead[field] ?? ''));
  }
  return payload;
}

/**
 * Sends one lead to the Google Apps Script web app.
 * Apps Script answers a POST with a redirect (302) to the real response. axios follows it,
 * and the row is already written by the time the redirect happens.
 * Never throws: it returns { ok, skipped?, error? } so the caller can decide what to do.
 */
export async function sendToGoogleSheet(lead) {
  // Use the specific audit webhook URL if provided, otherwise fallback to the general one
  const targetUrl = env.googleScriptUrlAudit || env.googleScriptUrl;
  
  if (!targetUrl) {
    return { ok: false, skipped: true, error: 'GOOGLE_SCRIPT_URL_AUDIT is not set' };
  }

  try {
    const response = await axios.post(targetUrl, toSheetPayload(lead), {
      headers: { 'Content-Type': 'application/json' },
      timeout: env.webhookTimeoutMs,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const finalUrl = response.request?.res?.responseUrl || '';
    if (finalUrl.includes('accounts.google.com')) {
      return {
        ok: false,
        error: 'Apps Script asked for a Google sign-in. Deploy the web app with access set to "Anyone".',
      };
    }

    const body = response.data;
    if (body && typeof body === 'object' && body.result === 'error') {
      return { ok: false, error: body.error || 'Apps Script reported an error' };
    }
    return { ok: true };
  } catch (err) {
    const reason = err.response ? `Apps Script answered with status ${err.response.status}` : err.message;
    return { ok: false, error: reason };
  }
}
