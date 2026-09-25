import { formatInr } from './format.js';

// Example messages a customer might send (used by the AI automation simulator).
export const PRESETS = [
  {
    label: 'Price enquiry',
    text: "Hi, I'm Neha from Jaipur. How much would invoice automation cost? My budget is around ₹50,000. Please call me on 98765 43210.",
  },
  {
    label: 'Book a demo',
    text: 'Hello, I run a coaching institute. Can we book a demo call this week? It is urgent, we get 100 WhatsApp messages a day.',
  },
  {
    label: 'Need a chatbot',
    text: 'Mujhe apni website ke liye ek chatbot chahiye jo customers ko jawab de. Kitna time lagega?',
  },
];

const INTENTS = [
  { label: 'Price or quote request', words: ['price', 'pricing', 'cost', 'quote', 'quotation', 'rate', 'charges', 'how much', 'budget'] },
  { label: 'Book a demo or call', words: ['demo', 'call', 'meeting', 'appointment', 'book', 'schedule', 'talk', 'discuss'] },
  { label: 'Invoice or payment help', words: ['invoice', 'invoices', 'payment', 'payments', 'billing', 'reminder', 'gst', 'receipt'] },
  { label: 'Chatbot or WhatsApp assistant', words: ['chatbot', 'chat bot', 'whatsapp', 'assistant', 'auto reply', 'autoreply'] },
  { label: 'Website or web app', words: ['website', 'web app', 'webapp', 'portal', 'dashboard', 'landing page'] },
];

const HINGLISH_WORDS = ['mujhe', 'chahiye', 'kitna', 'kitne', 'lagega', 'apni', 'apna', 'aap', 'hai', 'hain', 'karna', 'jawab', 'nahi', 'kya', 'ke', 'liye', 'mera', 'meri'];
const NOT_NAMES = ['Interested', 'Looking', 'Running', 'Working', 'Writing', 'Owner', 'Sorry'];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWord = (text, word) => new RegExp(`\\b${escapeRe(word)}\\b`, 'i').test(text);
const countWords = (text, words) => words.filter((w) => hasWord(text, w)).length;

function findName(text) {
  const match = text.match(/(?:\bi['’]?m|\bi am|\bmy name is|\bthis is|\bmera naam)\s+([^\s,.!?]+)/i);
  if (!match) return null;
  const word = match[1];
  return /^[A-Z][a-z]+$/.test(word) && !NOT_NAMES.includes(word) ? word : null;
}

function findBudget(text) {
  const match =
    text.match(/(?:₹|\b(?:rs\.?|inr))\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|lac)?/i) ||
    text.match(/\b([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|lac)\b/i);
  if (!match) return null;
  let value = parseFloat(match[1].replace(/,/g, ''));
  if (Number.isNaN(value)) return null;
  const unit = (match[2] || '').toLowerCase();
  if (unit === 'k' || unit === 'thousand') value *= 1e3;
  else if (unit) value *= 1e5;
  return value > 0 ? value : null;
}

function findPhone(text) {
  const match = text.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/);
  if (!match) return null;
  const digits = match[0].replace(/\D/g, '').slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function findIntent(text) {
  let best = { label: 'General enquiry', score: 0 };
  for (const intent of INTENTS) {
    const score = countWords(text, intent.words);
    if (score > best.score) best = { label: intent.label, score };
  }
  return best.label;
}

function findUrgency(text) {
  if (/\b(urgent|urgently|asap|immediately|right now|today|jaldi)\b/i.test(text)) return 'High';
  if (/\b(this week|tomorrow|soon|next week)\b/i.test(text)) return 'Medium';
  return 'Normal';
}

function findLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  return countWords(text, HINGLISH_WORDS) >= 2 ? 'Hinglish' : 'English';
}

// A simple rule-based reader. It shows the idea of "AI parses intent" without calling any real AI service.
export function parseEnquiry(text) {
  const clean = text.trim();
  const email = clean.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/);
  return {
    text: clean,
    name: findName(clean),
    phone: findPhone(clean),
    email: email ? email[0].toLowerCase() : null,
    budget: findBudget(clean),
    intent: findIntent(clean),
    urgency: findUrgency(clean),
    language: findLanguage(clean),
  };
}

const INTENT_REPLIES = {
  'Price or quote request':
    'Thanks for asking about pricing. Every business is different, so we start with a free workflow audit and then send you a clear price. Which day suits you for a short call?',
  'Book a demo or call':
    'We would be happy to show you a demo. Please reply with a day and time that suits you and we will send the meeting link.',
  'Invoice or payment help':
    'We can automate invoices and payment reminders so you stop chasing payments by hand. Which software do you use for billing today?',
  'Chatbot or WhatsApp assistant':
    'An assistant trained on your own documents can answer these questions day and night. Which questions do customers ask you the most?',
  'Website or web app':
    'We build websites, client portals and dashboards. What would you like your website to do for your customers?',
  'General enquiry':
    'Thanks for reaching out. Could you tell us a little more about the work you would like to make easier?',
};

export function buildReply(parsed) {
  const first = parsed.name;
  const greeting = parsed.language === 'English' ? `Hi ${first || 'there'}!` : `Namaste${first ? ` ${first}` : ''}!`;
  const lines = [greeting, INTENT_REPLIES[parsed.intent]];
  if (parsed.budget) lines.push(`Thanks for sharing your budget of ${formatInr(parsed.budget)}. It helps us suggest the right option.`);
  if (parsed.urgency === 'High') lines.push('We can see this is urgent, so we will look at it first.');
  lines.push('Team Navio Labs');
  return lines.join('\n\n');
}
