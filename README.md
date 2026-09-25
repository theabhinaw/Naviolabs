# Navio Labs website (MERN)

A production-ready website for Navio Labs: a React (Vite) front end and a Node.js + Express + MongoDB back end.
Leads from the "Book a free workflow audit" form are saved in MongoDB **and** sent to Google Sheets.

## What is inside

| Feature | Where |
| --- | --- |
| Sticky blurred header, dark/light toggle, mobile slide-out menu | `client/src/components/layout/Header.jsx` |
| Hero with animated workflow visualizer (lead follow-up, invoice tracking, support inbox) | `components/sections/Hero.jsx`, `WorkflowVisualizer.jsx` |
| 4 service pillars | `components/sections/Services.jsx` (text in `data/content.js`) |
| In-browser code playground: Python (Pyodide) and JavaScript (sandboxed Web Worker), 2 programs each | `components/sections/CodePlayground.jsx`, `services/codeRunner.js`, `public/workers/`, `data/programs/` |
| AI automation simulator (input, AI parses intent, Google Sheet row, WhatsApp reply) | `components/sections/AISimulator.jsx`, `utils/enquiryParser.js` |
| Time and cost savings estimator in ₹ (lakh / crore) with "Get my real number" auto-fill | `components/sections/Calculator.jsx` |
| 4-step process, founders, FAQ | `Process.jsx`, `Team.jsx`, `FAQ.jsx` |
| Lead form with validation, loading, success and error states | `components/sections/ContactForm.jsx`, `services/leadsApi.js` |
| WhatsApp buttons with a pre-filled message | `ContactForm.jsx`, `WhatsAppFab.jsx`, `Footer.jsx` |
| `/api/leads`: validate, save to MongoDB, forward to Google Sheets | `server/src/` |

## Folder structure

```
navio-labs/
├── package.json              scripts that run client and server together
├── docs/google-apps-script.gs   ready-made script for your Google Sheet
├── client/                   React app (Vite)
│   ├── public/               favicon, team photos, web workers for the playground
│   └── src/
│       ├── components/       layout/, sections/, ui/
│       ├── data/             all website text (content.js), workflows, playground programs
│       ├── hooks/  services/  utils/
│       └── styles/           design tokens + one CSS file per part of the page
└── server/                   Express API
    └── src/  config/  models/  validators/  middleware/  controllers/  routes/  services/
```

## Requirements

* Node.js 18 or newer (20 LTS recommended) and npm
* A MongoDB database: local MongoDB, or a free MongoDB Atlas cluster

## Set up, step by step

1. **Install everything**
   ```bash
   cd navio-labs
   npm run install:all
   ```
2. **Server settings**
   ```bash
   cp server/.env.example server/.env
   ```
   Open `server/.env` and set `MONGODB_URI`. The Google Sheets webhook URL is already filled in.
3. **Client settings**
   ```bash
   cp client/.env.example client/.env
   ```
   Open `client/.env` and set `VITE_WHATSAPP_NUMBER` (country code + number, digits only, for example `919876543210`).
   The WhatsApp buttons stay hidden until you do this.
4. **Start both apps**
   ```bash
   npm run dev
   ```
   * Website: http://localhost:5173
   * API: http://localhost:5000 (check http://localhost:5000/api/health)

In development Vite forwards `/api` calls to the Express server, so you do not need any CORS settings.

## Google Sheets webhook

Your webhook is already in `server/.env.example`. If you ever need a new one:

1. Create a Google Sheet, then **Extensions > Apps Script**.
2. Paste `docs/google-apps-script.gs` and save.
3. **Deploy > New deployment > Web app**. Execute as **Me**, access **Anyone**.
4. Copy the `/exec` URL into `GOOGLE_SCRIPT_URL` in `server/.env`.
5. After every change to the script, use **Deploy > Manage deployments > Edit > New version**.

The script creates a `Leads` tab and adds one row per request: Timestamp, Name, Email, Phone, Service, Message.
It also protects the sheet from formula injection (text starting with `=`, `+`, `-` or `@`).

## How a lead travels

```
Visitor fills the form
   │
   ├─► POST /api/leads  ──►  validate (zod)  ──►  save in MongoDB  ──►  forward to Google Apps Script
   │                                                    │                        │
   │                                        sheetStatus: sent / failed    (redirect is followed)
   │
   └─► If the API cannot be reached and VITE_GOOGLE_SCRIPT_URL is set:
       send straight to Google Sheets (text/plain, no-cors, so no preflight and no redirect problem)
```

* The request counts as **successful when MongoDB or Google Sheets worked**, so a lead is not lost if one is down.
  Only if both fail does the visitor see an error (with a WhatsApp link).
* Every saved lead records `sheetStatus` (`sent`, `failed`, `skipped`) and `sheetError`, so you can find and re-send failed ones.
* Spam protection: rate limit (10 requests per 15 minutes per address), a hidden honeypot field, request size limit, validation on both sides.
* The message shown after success is exactly: *Thank you! Your audit request is received, we will contact you shortly.*

## Environment variables

**server/.env**

| Name | Meaning |
| --- | --- |
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_ORIGIN` | Allowed website address(es), comma separated. Use your real domain in production |
| `SERVE_CLIENT` | `true` = Express also serves the built website (default `true` in production) |
| `TRUST_PROXY` | Number of proxies in front of the server (Render/Railway: `1`) so rate limiting sees real visitor addresses |
| `MONGODB_URI` | MongoDB connection string |
| `GOOGLE_SCRIPT_URL` | Your Apps Script web app URL |
| `WEBHOOK_TIMEOUT_MS` | How long to wait for Google (default 10000) |

**client/.env** (only `VITE_` variables reach the browser)

| Name | Meaning |
| --- | --- |
| `VITE_API_URL` | API address. Empty in development. In production, set it only if the API is on another domain |
| `VITE_GOOGLE_SCRIPT_URL` | Optional direct fallback to Google Sheets. Anyone can read it in the browser, so leave it empty if you prefer to keep the URL private |
| `VITE_CONTACT_EMAIL` | Shown on the site (default `hello@naviolabs.com`) |
| `VITE_WHATSAPP_NUMBER` | Digits only with country code. Enables the WhatsApp buttons |

## Change the content

* **All text** (services, process, FAQ, team, stats, tools list): `client/src/data/content.js`
* **Team photos**: put images in `client/public/team/` and set `photo: '/team/abhinaw.jpg'` in `content.js`. Without a photo a framed circle with initials is shown.
* **Colours and fonts**: `client/src/styles/tokens.css` (light and dark values).
* **Services in the form**: keep `SERVICE_OPTIONS` in `content.js` and `SERVICES` in `server/src/models/Lead.js` the same.
* **Logo**: `components/layout/Logo.jsx` (same SVG and CSS classes as the original design).

## The code playground

* **Python** runs with [Pyodide](https://pyodide.org) (Python compiled to WebAssembly) inside a Web Worker. Nothing is sent to a server.
  Pyodide is downloaded from the jsDelivr CDN the first time (version set in `client/public/workers/pyodide-worker.js`). Only the Python standard library is available.
* **JavaScript** runs in a locked-down Web Worker (`public/workers/js-worker.js`): no page or cookie access, `fetch`, `XMLHttpRequest`, `WebSocket` and storage are switched off, and it is stopped after 5 seconds.
  Python is stopped after 8 seconds (a fresh engine starts on the next run).
* Visitors can edit the code. Ctrl/Cmd + Enter runs it. Reset restores the original.
* **Add your own program**: create a file in `client/src/data/programs/`, import it with `?raw` in `client/src/data/programs.js` and add an entry with the three plain-English explanation lines.

## Build and deploy

**Option A: one server for everything (simplest)**, for example Render, Railway or a VPS:
```bash
npm run install:all
npm run build                 # builds client/dist
NODE_ENV=production npm start # Express serves the API and the website
```
Set `NODE_ENV=production`, `MONGODB_URI`, `GOOGLE_SCRIPT_URL`, `CLIENT_ORIGIN=https://yourdomain.com` and `TRUST_PROXY=1` on the host.

**Option B: split**: put `client/` on Netlify or Vercel (build `npm run build`, publish `dist`, set `VITE_API_URL=https://your-api-domain`) and `server/` on Render or Railway with `CLIENT_ORIGIN=https://your-website-domain`.

The server sends a Content-Security-Policy that allows what the site needs (jsDelivr for Pyodide, Google Fonts, the Google Sheets webhook, `unsafe-eval` for the code runners).
If you add other external scripts, add them in `server/src/app.js`.

## Security notes

* Keep `.env` files out of Git (already in `.gitignore`). `.env.example` contains your webhook URL, so do not publish it in a public repository.
* Anyone who knows the Apps Script URL can post rows to your sheet. The API path adds validation and rate limiting, which the direct browser fallback cannot. Leave `VITE_GOOGLE_SCRIPT_URL` empty if you do not want that fallback.
* The API has no admin endpoints. Read leads in MongoDB (Atlas or Compass) or in your Google Sheet.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Rows do not appear in the sheet, lead shows `sheetStatus: failed` | Redeploy the Apps Script as a **new version** with access **Anyone**. Open the `/exec` URL in a browser; it should say "Navio Labs lead webhook is running." |
| `MongoDB connection failed` | Check `MONGODB_URI` and, on Atlas, allow your IP under Network Access. The site still works: leads go to Google Sheets |
| Python says it could not start | Needs an internet connection to load Pyodide. Check your network and the CSP if you changed it |
| WhatsApp buttons missing | Set `VITE_WHATSAPP_NUMBER` in `client/.env` and restart `npm run dev` |
| Form shows "Too many requests" | The rate limit was hit (10 per 15 minutes). Wait, or change it in `server/src/middleware/rateLimiters.js` |

## What was tested before delivery

* Every server file passes a syntax check. The server could not be started in the build environment (no internet to install packages), so please run the steps above once and check `/api/health`.
* The React app was bundled and run in a real browser at desktop, tablet and phone sizes, in light and dark mode, with a mocked API: hero animation, menu, playground (JavaScript sandbox, time limit, blocked network), simulator, calculator auto-fill, form validation, success and error states, direct Google Sheets fallback, honeypot and reduced motion. Pyodide itself was replaced by a stand-in in that test (no internet), and the two npm packages `react-simple-code-editor` and `prismjs` were replaced by simple stand-ins.
* All four playground programs were run with real Python 3 and Node and produce the output shown in the explanation cards.
