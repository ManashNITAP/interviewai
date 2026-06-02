# InterviewAI

AI-powered mock interview & resume rating platform.

**Stack:** React + Vite + Tailwind (client) · Node + Express + MongoDB (server) · Google Gemini · Cloudinary · Socket.IO · JWT (httpOnly cookies).

```
interviewai/
├── render.yaml          # One-click Render Blueprint (two services)
├── server/              # Express API (MVC + service layer + ai/ module)
│   └── src/
│       ├── ai/          # Swappable LLM provider, prompts, schemas, runner
│       ├── config/  controllers/  middleware/  models/
│       ├── routes/  services/  sockets/  utils/  validators/
│       ├── scripts/seedAdmin.js
│       ├── app.js  server.js
└── client/              # React SPA
    └── src/
        ├── api/  context/  routes/  components/  pages/  utils/
        ├── main.jsx  App.jsx
```

## Quick start (local)

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string (Atlas free tier or local mongod)
- A Cloudinary account (cloud name + API key + secret)
- A Google Gemini API key (Google AI Studio)

### 1. Backend
```bash
cd server
npm install
cp .env.example .env       # then fill in the values
npm run dev                # http://localhost:5000
```
Generate two DIFFERENT JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"   # run twice
```
(Optional) seed an admin account:
```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourStrongPass ADMIN_NAME="You" npm run seed:admin
```

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env       # defaults are fine for local dev
npm run dev                # http://localhost:5173
```
Open http://localhost:5173. The Vite dev server proxies `/api` and `/socket.io` to the backend on port 5000.

> Without SMTP configured, password-reset links are printed to the backend console instead of emailed.

## Deploy to Render
This repo includes `render.yaml`, a Blueprint that provisions both services. See the in-app docs or the project write-up for the full step-by-step (MongoDB Atlas setup, secrets, admin seeding, verification). In short: push to GitHub → Render → New → Blueprint → fill the `sync:false` secrets → Deploy.

## Notes
- AI outputs are validated against Zod schemas with automatic retry-and-correct.
- Switch LLM provider by implementing `ai/providers/llm.interface.js` and registering it in `ai/providers/index.js`.
- Token/cost telemetry is logged per AI call (pricing constants are illustrative — verify current rates).
