# Deploy to Vercel

This project is wired up to deploy on Vercel as a single project that serves
both the React frontend (static) and the Node backend (serverless functions),
all from one URL.

```
┌──────────────────────────────────────────────────────────┐
│ your-project.vercel.app                                  │
│                                                          │
│   /            → frontend (static SPA from frontend/dist)│
│   /dashboard   → frontend (SPA fallback to index.html)   │
│   /extract-resume → backend serverless function           │
│   /api/resumes/*     → backend serverless function        │
└──────────────────────────────────────────────────────────┘
```

## What's set up

- `vercel.json` at the project root — defines two builds (static frontend +
  `@vercel/node` serverless backend) and the rewrite routes.
- `backend/api/index.js` — Vercel serverless entry that exports the Express app.
- `backend/src/app.js` — Express app without `app.listen()` (serverless-safe).
- `backend/src/index.js` — still works as your local-dev entry (`npm start`).
- `frontend/src/config/api.js` — central API URL helper that reads
  `VITE_API_BASE_URL` (defaults to `http://localhost:5000` so `npm run dev`
  keeps working without env setup).

## Required environment variables

You must set these in the Vercel project dashboard (or via `vercel env`):

### Backend (`GROQ_API_KEY`)

Add in **Vercel → Project → Settings → Environment Variables**:

| Name           | Value                                  |
| -------------- | -------------------------------------- |
| `GROQ_API_KEY` | the same key from your local `.env`    |

### Frontend (`VITE_FIREBASE_*`)

Same place. All six are required for auth + Firestore to initialise:

| Name                              | Source (Firebase Console → Project Settings) |
| --------------------------------- | -------------------------------------------- |
| `VITE_FIREBASE_API_KEY`           | Web app config                               |
| `VITE_FIREBASE_AUTH_DOMAIN`       | Web app config                               |
| `VITE_FIREBASE_PROJECT_ID`        | Web app config                               |
| `VITE_FIREBASE_STORAGE_BUCKET`    | Web app config                               |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Web app config                            |
| `VITE_FIREBASE_APP_ID`            | Web app config                               |

Vite only bakes in variables prefixed with `VITE_`, so the names must match
exactly.

## Vercel caveats for this backend

- **Body size limit** — 4.5 MB on the Hobby (free) tier. PDF/DOCX uploads above
  that will fail. Upgrade to Pro for larger.
- **Function timeout** — 10 s on Hobby, 60 s on Pro. Resume extraction does
  `pdf-parse` + 2 Groq calls; large documents can exceed 10 s.
- **Cold start** — first request after idle is slow. Acceptable for portfolio
  / demo traffic; consider Pro if you expect real users.
- **CORS** — `cors()` in the backend allows every origin, which is fine while
  the frontend is on the same origin. If you split the deploy later, lock this
  down to the frontend domain.
- **`firebaseAdmin.js`** — currently dead code in the import chain; the live
  backend only uses `express`, `multer`, `groq-sdk`, `pdf-parse`, `mammoth`,
  `docx`, `cors`, `dotenv`. Firebase Admin is not loaded, so the missing
  `serviceAccountKey.json` does not break deploys.

## Deploy — Option A: CLI

From the project root:

```powershell
npx vercel login        # one-time, opens browser
npx vercel link         # link this folder to a Vercel project
npx vercel env add GROQ_API_KEY production
npx vercel env add VITE_FIREBASE_API_KEY production
npx vercel env add VITE_FIREBASE_AUTH_DOMAIN production
npx vercel env add VITE_FIREBASE_PROJECT_ID production
npx vercel env add VITE_FIREBASE_STORAGE_BUCKET production
npx vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
npx vercel env add VITE_FIREBASE_APP_ID production
npx vercel deploy --prod
```

## Deploy — Option B: GitHub → Vercel Dashboard

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Vercel will detect `vercel.json` automatically. Leave all build settings as
   detected.
4. Add the env vars listed above under **Environment Variables**.
5. Click **Deploy**. Every push to the connected branch will redeploy.

## Local development after this change

Nothing has changed for local dev:

```powershell
# terminal 1
cd backend
npm start         # → http://localhost:5000

# terminal 2
cd frontend
npm run dev       # → http://localhost:5173
```

`VITE_API_BASE_URL` is unset locally, so the frontend keeps calling
`http://localhost:5000` exactly as before.
