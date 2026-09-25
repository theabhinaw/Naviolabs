const env = import.meta.env ?? {};
const API_URL = String(env.VITE_API_URL || '').replace(/\/$/, '');
const SCRIPT_URL = String(env.VITE_GOOGLE_SCRIPT_URL_AUDIT || env.VITE_GOOGLE_SCRIPT_URL || '');

export class ValidationError extends Error {
  constructor(message, fieldErrors) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Google Apps Script does not answer CORS "preflight" checks and replies with a redirect.
// A plain text/plain request in "no-cors" mode avoids both problems. The reply cannot be read
// (it is "opaque"), so a request that did not fail is treated as sent.
async function postToGoogleScript(lead) {
  await fetchWithTimeout(
    SCRIPT_URL,
    {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(lead),
    },
    15000
  );
}

/**
 * Sends the audit request.
 *  1. Normal path: POST /api/leads. The server saves it in MongoDB and forwards it to Google Sheets.
 *  2. Safety net: if the server cannot be reached, send it straight to Google Sheets (when a URL is set).
 * Throws ValidationError (field problems from the server) or a normal Error with a friendly message.
 */
export async function submitLead(values) {
  const { website, ...lead } = values; // "website" is the hidden spam-trap field
  if (website) return { ok: true, via: 'ignored' };

  try {
    const response = await fetchWithTimeout(
      `${API_URL}/api/leads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      },
      15000
    );
    const data = await response.json().catch(() => null);

    if (response.ok && data && data.success) return { ok: true, via: 'api' };

    if (response.status === 400 && data && data.errors) {
      throw new ValidationError(data.message || 'Please check the highlighted fields.', data.errors);
    }
    if (response.status === 429) {
      const tooMany = new Error((data && data.message) || 'Too many requests. Please try again in a few minutes.');
      tooMany.final = true;
      throw tooMany;
    }
    console.warn('[leads] The API could not save the request:', response.status, data);
  } catch (err) {
    if (err instanceof ValidationError || err.final) throw err;
    console.warn('[leads] The API could not be reached:', err);
  }

  if (SCRIPT_URL) {
    try {
      await postToGoogleScript(lead);
      return { ok: true, via: 'google-sheets' };
    } catch (err) {
      console.warn('[leads] Direct Google Sheets request failed:', err);
    }
  }

  throw new Error(
    'We could not send your request. Please check your internet connection and try again, or message us on WhatsApp.'
  );
}
