const env = import.meta.env ?? {};

export const SITE = {
  name: 'Navio Labs',
  tagline: 'Practical AI integration, custom workflows, and full-stack solutions for growing businesses.',
  email: env.VITE_CONTACT_EMAIL || 'hello@naviolabs.com',
  // Digits only, with country code. Example: 919876543210
  whatsapp: String(env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  whatsappMessage: 'Hi Navio Labs, I would like to book a free workflow audit.',
  founders: 'Abhinaw Patel and Deepika Pal',
};

// Links in the top bar and the mobile menu
export const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/#playground', label: 'Playground' },
  { href: '/#simulator', label: 'Live demo' },
  { href: '/#savings', label: 'Savings' },
  { href: '/#team', label: 'Team' },
  { href: '/#faq', label: 'FAQ' },
];

// Stops on the little route line at the left edge of the page (desktop). Each id is a section id.
export const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'playground', label: 'Playground' },
  { id: 'simulator', label: 'Live demo' },
  { id: 'savings', label: 'Savings' },
  { id: 'process', label: 'How it works' },
  { id: 'team', label: 'Team' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

export const HERO_STATS = [
  { value: 'Free', label: 'first workflow audit, no commitment' },
  { value: '4', label: 'services under one roof' },
  { value: '24/7', label: 'support after your launch' },
  { value: '1-2 weeks', label: 'for a simple first automation' },
];

export const TOOLS = [
  'OpenAI',
  'Claude',
  'Gemini',
  'n8n',
  'Make',
  'Zapier',
  'WhatsApp Business',
  'Google Workspace',
  'Slack',
  'HubSpot',
  'Zoho',
  'MongoDB',
  'React',
  'Node.js',
];

export const SERVICES = [
  {
    id: 'ai-integration',
    title: 'AI Integration',
    lane: 'cobalt',
    text: 'We connect AI tools such as OpenAI, Claude and Gemini directly to the apps you already use every day: your email, WhatsApp, Google Sheets and CRM. The AI reads, writes and sorts things for you, right where your team already works.',
    points: [
      'Reads emails, forms and documents for you',
      'Answers questions from your own files',
      'Writes summaries and reports automatically',
    ],
    tools: ['OpenAI', 'Claude', 'Gemini'],
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    lane: 'teal',
    text: 'No more copying and pasting between apps. We use tools like n8n, Zapier and Make, plus custom scripts when needed, so one action in one app quietly starts the next steps in the others.',
    points: [
      'Leads, invoices and onboarding run by themselves',
      'Your apps stay in sync automatically',
      'Alerts on WhatsApp, Slack or email',
    ],
    tools: ['n8n', 'Zapier', 'Make', 'Custom scripts'],
  },
  {
    id: 'ai-agents',
    title: 'Custom AI Agents and Chatbots',
    lane: 'coral',
    text: 'Smart assistants for WhatsApp and your website, trained on your own company documents. They answer customer questions, collect enquiry details and pass the tricky ones to your team.',
    points: [
      'Learns from your FAQs, price lists and documents',
      'Hands over to a real person when needed',
      'Replies in Hindi and English',
    ],
    tools: ['WhatsApp', 'Website chat', 'Your documents'],
  },
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    lane: 'amber',
    text: 'Custom web applications built from start to finish on the MERN stack (MongoDB, Express, React and Node.js): client portals, admin dashboards and business tools made for the way you work.',
    points: [
      'Company websites and web apps',
      'Client portals and admin dashboards',
      'Automation built right into the product',
    ],
    tools: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
];

export const PROCESS_STEPS = [
  {
    title: 'Free Workflow Audit',
    text: 'A friendly call where you show us how work moves through your team today. We look for the tasks that repeat, slow you down or cause mistakes.',
    gets: 'a short list of what is worth automating first.',
  },
  {
    title: 'Plan and Transparent Architecture',
    text: 'We draw the whole plan in simple pictures: which apps are connected, what happens at each step and what it costs. No hidden parts, so you know exactly what you are getting.',
    gets: 'a one-page plan, a timeline and a clear price you can approve or change.',
  },
  {
    title: 'Build and Real-Data Testing',
    text: 'We build in small pieces. You try each piece with your real data, like actual enquiries or invoices, before we go further. Steps that matter get an approval, so a person always stays in control.',
    gets: 'a working automation that has been tested on your own data.',
  },
  {
    title: 'Live Launch and 24/7 Ongoing Support',
    text: 'We switch it on, show your team how to use it and keep watching it. If something breaks or your business changes, we fix and update it.',
    gets: 'training, simple guides and support whenever you need us.',
  },
];

export const TEAM = [
  {
    id: 'abhinaw',
    name: 'Abhinaw Patel',
    role: 'Founder and Owner',
    lane: 'cobalt',
    photo: '/team/abhinaw.jpg',
    bio: 'Leads the company vision, system design, AI model integration and custom full-stack solutions. Dedicated to making AI practical for business teams who are not technical.',
    focus: ['Company vision', 'AI integration', 'Full-stack solutions'],
  },
  {
    id: 'deepika',
    name: 'Deepika Pal',
    role: 'Co-founder',
    lane: 'teal',
    photo: '/team/deepika.jpg',
    bio: 'Co-founded Navio Labs and leads project delivery, quality checks, workflow testing and client success, so every automation is smooth and reliable.',
    focus: ['Project delivery', 'Quality and testing', 'Client success'],
  },
];

export const FAQS = [
  {
    q: 'Is my business data safe?',
    a: 'We only ask for the access each automation really needs, and we agree with you in advance what data is used and where it goes. Passwords and keys are kept in secure storage, never in plain text, and you can remove our access at any time.',
  },
  {
    q: 'Will automation replace my team?',
    a: 'No. We automate boring, repeating tasks, not people. Your team gets time back for work that needs a human, like talking to customers. Where a decision matters, we add an approval step so a person stays in control.',
  },
  {
    q: 'How long will it take?',
    a: 'A simple first automation can often be live in one to two weeks. Bigger projects, like custom web apps, take longer, so we split them into stages and you see progress early. You get a clear timeline before we start.',
  },
  {
    q: 'How much does it cost?',
    a: 'It depends on what you need. After the free audit you get a clear scope and a fixed price in writing, so there are no surprises. Many businesses start small with one workflow and add more later.',
  },
  {
    q: 'Do I need to change the software I already use?',
    a: 'No. We connect to what you already have, such as WhatsApp, Gmail, Google Sheets, your CRM or accounting software. We suggest something new only when it clearly saves you effort.',
  },
  {
    q: 'What if something stops working after launch?',
    a: 'We keep an eye on your automations and fix problems quickly. Support after launch is part of every project, and we update things whenever your business changes.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'Not at all. We explain everything in plain language, and we build things your team can use without any technical knowledge.',
  },
];

// Keep this list in sync with SERVICES in server/src/models/Lead.js
export const SERVICE_OPTIONS = [
  'Workflow automation',
  'AI integration',
  'AI agent or chatbot',
  'Web development',
  'Not sure yet',
];
