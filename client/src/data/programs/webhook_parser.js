// Webhook Payload Parser and Formatter
// Takes the raw data another app sends us and turns it into a clean, readable message.

const rawPayload = `{
  "event": "order.paid",
  "created_at": "2026-09-20T09:15:00Z",
  "customer": { "name": "  amit KUMAR ", "email": "AMIT.KUMAR@Example.com", "phone": "98765-43210" },
  "items": [
    { "title": "WhatsApp chatbot setup", "qty": 1, "price": 25000 },
    { "title": "Workflow audit", "qty": 2, "price": 0 }
  ],
  "notes": "Please call after 5 pm"
}`;

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const titleCase = (text) => text.trim().toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

function tidyPhone(text) {
  const digits = text.replace(/\D/g, "").slice(-10);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function parseWebhook(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error("The webhook body is not valid JSON: " + error.message);
  }
  const missing = ["event", "customer", "items"].filter((key) => !(key in data));
  if (missing.length) throw new Error("Missing fields: " + missing.join(", "));
  return data;
}

function formatOrder(data) {
  const customer = data.customer;
  const lines = data.items.map((item) => {
    const cost = item.price === 0 ? "Free" : rupees.format(item.price * item.qty);
    return `  - ${item.title} x${item.qty}: ${cost}`;
  });
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const when = new Date(data.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return [
    "New paid order",
    `Customer: ${titleCase(customer.name)}`,
    `Email:    ${customer.email.trim().toLowerCase()}`,
    `Phone:    ${tidyPhone(customer.phone)}`,
    `Time:     ${when} (IST)`,
    "Items:",
    ...lines,
    `Total: ${rupees.format(total)}`,
    data.notes ? `Note: ${data.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

try {
  const order = parseWebhook(rawPayload);
  console.log(formatOrder(order));
  console.log("\nThis message could now be sent to Slack or WhatsApp automatically.");
} catch (error) {
  console.log("Could not read the webhook:", error.message);
}
