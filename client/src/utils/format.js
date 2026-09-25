export const formatNumberIN = (n) => Math.round(n).toLocaleString('en-IN');

export const roundTo = (n, step) => Math.round(n / step) * step;

export const formatInr = (n) => `₹${formatNumberIN(n)}`;

// 1.5 lakh, 2.6 crore ... easier to read than 15,00,000
export function formatInrCompact(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1).replace(/\.0$/, '')} crore`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, '')} lakh`;
  return formatInr(n);
}

export function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

// Digits only, with country code. Returns null when no number is configured.
export function whatsappLink(number, text) {
  if (!number) return null;
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
