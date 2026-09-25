// The code shown in the playground lives in ./programs/ as plain files, so it is easy to edit and test.
// "?raw" tells Vite to load a file as text.
import leadExtractor from './programs/lead_extractor.py?raw';
import salesCleaner from './programs/sales_cleaner.py?raw';
import webhookParser from './programs/webhook_parser.js?raw';
import savingsCalculator from './programs/savings_calculator.js?raw';

export const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
];

export const PROGRAMS = {
  python: [
    {
      id: 'py-leads',
      title: 'Email and lead extractor',
      file: 'lead_extractor.py',
      code: leadExtractor,
      problem: 'Enquiries arrive as messy emails and WhatsApp messages. Someone has to read each one and type the details into a sheet.',
      does: 'It reads the raw text and picks out the name, email, phone number and what the person is interested in.',
      benefit: 'Your team stops copy-pasting. New leads are ready in seconds, with no typing mistakes.',
    },
    {
      id: 'py-sales',
      title: 'CSV sales data cleaner',
      file: 'sales_cleaner.py',
      code: salesCleaner,
      problem: 'Sales data from billing software is messy: blank rows, rupee signs and capital letters in odd places. Adding it up by hand takes hours and mistakes creep in.',
      does: 'It cleans the file, adds up the money for each month and lists unpaid invoices that are past their due date.',
      benefit: 'You see what money is coming in and who to remind, without opening a spreadsheet.',
    },
  ],
  javascript: [
    {
      id: 'js-webhook',
      title: 'Webhook payload parser',
      file: 'webhook_parser.js',
      code: webhookParser,
      problem: 'When someone pays or fills in a form, another app sends your system a block of raw data that no person can read easily.',
      does: 'It reads that data, checks that nothing is missing and turns it into a short, tidy message.',
      benefit: 'Your team gets a clear alert on Slack or WhatsApp the moment an order arrives.',
    },
    {
      id: 'js-savings',
      title: 'Savings calculator API simulator',
      file: 'savings_calculator.js',
      code: savingsCalculator,
      problem: 'You want to know what an automation is worth, sometimes in other currencies for overseas clients.',
      does: 'It asks a pretend exchange-rate service for today\'s rates, does the maths and shows the answer.',
      benefit: 'Quick, reliable numbers for quotes and proposals, with no manual calculating.',
    },
  ],
};
