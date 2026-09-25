// The three example workflows shown in the hero. "color" is the name of a colour token (see tokens.css).
export const WORKFLOWS = {
  lead: {
    label: 'Lead follow-up',
    color: 'cobalt',
    steps: [
      { title: 'Enquiry arrives', text: 'A form, email or WhatsApp message comes in from a new customer.', apps: ['Website form', 'Email', 'WhatsApp'] },
      { title: 'AI reads it', text: 'It picks out what they need, their budget and how urgent it is.', apps: ['OpenAI', 'Claude', 'Gemini'] },
      { title: 'Saved to your CRM', text: 'A clean record is created in your CRM or sheet. No copy and paste.', apps: ['Google Sheets', 'HubSpot', 'Zoho'] },
      { title: 'Reply goes out', text: 'The customer gets a relevant answer in their language within minutes.', apps: ['WhatsApp', 'Email'] },
      { title: 'Your team is told', text: 'Sales gets a short summary, and a call is booked if the lead is a good fit.', apps: ['Slack', 'Google Calendar'] },
    ],
  },
  invoice: {
    label: 'Invoice tracking',
    color: 'teal',
    steps: [
      { title: 'Order confirmed', text: 'You mark a deal as won or a job as finished. That is the only manual step.', apps: ['CRM', 'Google Sheets'] },
      { title: 'Invoice drafted', text: 'Client details and line items are pulled in and the invoice is created.', apps: ['Zoho Books', 'QuickBooks', 'Google Docs'] },
      { title: 'You approve', text: 'You get the draft on your phone and approve it with one tap.', apps: ['WhatsApp', 'Slack'] },
      { title: 'Sent with a pay link', text: 'The client receives it by email or WhatsApp with a payment link.', apps: ['Email', 'WhatsApp', 'Razorpay'] },
      { title: 'Reminders run', text: 'Polite follow-ups go out until it is paid. Then your records update themselves.', apps: ['Email', 'WhatsApp', 'Google Sheets'] },
    ],
  },
  support: {
    label: 'Support inbox',
    color: 'coral',
    steps: [
      { title: 'Question arrives', text: 'Email, chat and WhatsApp messages all land in one place.', apps: ['Email', 'Website chat', 'WhatsApp'] },
      { title: 'AI finds the answer', text: 'It searches your FAQs, documents and past tickets.', apps: ['Your FAQs', 'Documents', 'Past tickets'] },
      { title: 'Confidence check', text: 'Clear questions are answered. Unclear ones are flagged for a person.', apps: ['Rules you set'] },
      { title: 'Answer sent', text: 'The customer gets a clear reply with the right links attached.', apps: ['Email', 'Chat', 'WhatsApp'] },
      { title: 'Your team takes over', text: 'Anything complicated goes to the right person with the full history.', apps: ['Freshdesk', 'Slack', 'Notion'] },
    ],
  },
};
