# Resume Generator — Backend

A production-grade Node.js + Express backend for the Resume Generator
project. Implements the full 19-step user flow:

```
target role  →  job description  →  resume input  →  extraction
     ↓
role analysis  →  skill gap  →  blueprint  →  generation
     ↓
quality check  →  editor / versions  →  preview  →  PDF export
```

The backend is **stateless from a request standpoint** but every step
is persisted to a project document so the user can return and pick up
where they left off.

---

## Highlights

- **Layered architecture** — `routes → controllers → services → repositories`.
- **First-class error handling** — typed `HttpError`, structured envelope,
  request-id correlation, redacted logs.
- **Security by default** — Helmet, CORS allow-list, rate limits (per-route),
  multer file-type guards, Joi request validation.
- **AI-ready** — calls Groq when `GROQ_API_KEY` is set, otherwise falls
  back to a deterministic extractor so the API stays usable in dev / CI.
- **Storage-pluggable** — in-memory store for dev/tests, Firebase Admin SDK
  for production (`STORAGE=firebase`).
- **Auth-pluggable** — `AUTH_MODE=off|optional|required`, with Firebase
  ID-token verification in `required` mode.
- **OpenAPI 3.0** spec served at `/openapi.json`, Swagger UI at `/docs`.
- **Minimal HTML UI** at `/` so you can drive the API from a browser.
- **Health checks** — `/health`, `/health/live`, `/health/ready`.
- **Graceful shutdown** + signal handling.
- **Docker** + `docker-compose` for one-line deploys.
- **Tests** — Jest + Supertest, no external services required.

---

## Quick start

```bash
# 1) Install
cd backend
npm install

# 2) Configure (optional — works out of the box without a key)
cp .env.example .env
# edit .env if you want real AI / real storage

# 3) Run
npm start
# or, with auto-reload:
npm run dev
```

Open:

| URL                   | What's there                              |
| --------------------- | ----------------------------------------- |
| http://localhost:5000/         | Minimal HTML console                |
| http://localhost:5000/health   | Liveness + readiness                |
| http://localhost:5000/docs     | Swagger UI                          |
| http://localhost:5000/openapi.json | Raw OpenAPI spec                |

## Environment

See [`.env.example`](./.env.example) for the full list.

| Var                | Default                       | Notes |
| ------------------ | ----------------------------- | ----- |
| `NODE_ENV`         | `development`                 | |
| `PORT`             | `5000`                        | |
| `CORS_ORIGIN`      | `*`                           | CSV of allowed origins |
| `GROQ_API_KEY`     | _empty_                       | Leave empty to use the deterministic fallback |
| `GROQ_MODEL`       | `llama-3.3-70b-versatile`     | |
| `AI_TIMEOUT_MS`    | `60000`                       | |
| `STORAGE`          | `memory`                      | `memory` or `firebase` |
| `AUTH_MODE`        | `off`                         | `off`, `optional`, or `required` |
| `MAX_UPLOAD_BYTES` | `10485760`                    | |
| `RATE_LIMIT_MAX`   | `120`                         | per `RATE_LIMIT_WINDOW_MS` |
| `LOG_LEVEL`        | `info`                        | |

When `STORAGE=firebase` you also need to set `FIREBASE_PROJECT_ID`,
`FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (with `\n` escapes
preserved). The Admin SDK is initialized lazily at boot.

When `AUTH_MODE=required`, every API request needs a Firebase ID token
in `Authorization: Bearer <token>`. In dev you can set
`AUTH_DEV_BYPASS_HEADER` and pass it via the `X-Dev-Bypass` request
header.

## API surface

| Method | Path                                          | Description |
| ------ | --------------------------------------------- | ----------- |
| GET    | `/`                                           | Service metadata |
| GET    | `/health`                                     | Liveness + readiness (5s cache) |
| GET    | `/health/live`                                | Process liveness |
| GET    | `/health/ready`                               | Full readiness |
| GET    | `/openapi.json`                               | OpenAPI 3.0 spec |
| GET    | `/docs`                                       | Swagger UI |
| GET    | `/api/auth/me`                                | Current authenticated user |
| POST   | `/extract-resume`                             | **Compat**: extract from JSON text or file upload |
| POST   | `/api/extract/text`                           | Extract from JSON `{ text }` |
| POST   | `/api/extract/file`                           | Extract from multipart upload |
| POST   | `/api/projects`                               | Create a new resume project |
| GET    | `/api/projects/list`                          | List current user's projects |
| GET    | `/api/projects/:id`                           | Get a project |
| DELETE | `/api/projects/:id`                           | Delete a project |
| POST   | `/api/projects/:id/target-role`               | Set target role |
| POST   | `/api/projects/:id/job-description`           | Set job description |
| POST   | `/api/projects/:id/resume`                    | Attach resume (JSON or `rawText`) |
| POST   | `/api/projects/:id/role-analysis`             | Run role analysis |
| POST   | `/api/projects/:id/skill-gap`                 | Run skill-gap analysis |
| POST   | `/api/projects/:id/blueprint`                 | Build blueprint |
| POST   | `/api/projects/:id/generate`                  | Generate final resume |
| GET    | `/api/projects/:id/quality-check`             | Latest quality check |
| GET    | `/api/projects/:id/preview?template=…`        | HTML preview |
| POST   | `/api/projects/:id/export/pdf`                | Export PDF |
| GET    | `/api/projects/:id/export/jobs/:jobId`        | Get export job status |
| GET    | `/api/projects/:id/versions`                  | List versions |
| POST   | `/api/projects/:id/versions`                  | Save a version |
| GET    | `/api/projects/:id/versions/:versionId`       | Get a specific version |
| POST   | `/api/ai/role-analysis`                       | One-shot role analysis |
| POST   | `/api/ai/skill-gap`                           | One-shot skill gap |
| POST   | `/api/ai/blueprint`                           | One-shot blueprint |
| POST   | `/api/ai/generate`                            | One-shot generation |
| POST   | `/api/ai/quality-check`                       | One-shot quality check |
| GET    | `/api/ai/templates`                           | List resume templates |

### Response envelope

Successful:

```json
{ "success": true, "data": { "...": "..." }, "meta": { "...": "..." } }
```

Failed:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [{ "part": "body", "path": "text", "message": "..." }],
    "requestId": "..."
  }
}
```

Stable error codes: `BAD_REQUEST`, `VALIDATION_ERROR`, `UNAUTHORIZED`,
`FORBIDDEN`, `NOT_FOUND`, `ROUTE_NOT_FOUND`, `CONFLICT`,
`PAYLOAD_TOO_LARGE`, `UNSUPPORTED_MEDIA_TYPE`, `TOO_MANY_REQUESTS`,
`INTERNAL_SERVER_ERROR`, `AI_DISABLED`, `AI_TIMEOUT`, `AI_INVALID_JSON`,
`PDF_PARSE_FAILED`, `DOCX_PARSE_FAILED`, `EMPTY_TEXT`, `EMPTY_INPUT`.

## Development

```bash
npm run dev           # node --watch
npm test              # run the test suite
npm run test:coverage # run with coverage
npm run smoke         # boot the app and hit core endpoints
```

### Project layout

```
backend/
├── public/                    # minimal HTML UI served at /
├── src/
│   ├── ai/                    # (legacy) groq test scripts
│   ├── config/                # env, logger, openapi, constants, firebase
│   ├── controllers/           # thin HTTP layer
│   ├── data/                  # schema + templates
│   ├── middleware/            # auth, validate, upload, errors, rate limit
│   ├── parsers/               # PDF + DOCX text extraction
│   ├── prompts/               # LLM system prompts
│   ├── repositories/          # memoryStore + project / version / exportJob
│   ├── routes/                # express routers
│   ├── services/              # AI + extraction + generation + export
│   ├── utils/                 # httpError, asyncHandler, ids, response
│   ├── validators/            # Joi schemas
│   ├── app.js                 # express app builder
│   └── index.js               # server entry
├── tests/                     # jest + supertest
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Docker

```bash
docker build -t resume-generator-backend .
docker run --rm -p 5000:5000 --env-file .env resume-generator-backend
# or:
docker compose up --build
```

## Notes on AI usage

Every prompt enforces the project factuality rule: **never invent facts**.
The extractor, generator, and quality-check prompts all explicitly forbid
hallucinated skills, jobs, or dates. The quality-check pass is a separate
LLM call that compares the generated resume to the source resume and
flags unsupported claims.

If `GROQ_API_KEY` is missing, every AI endpoint still responds — it
falls back to a deterministic, conservative implementation. The response
explicitly notes that AI is disabled so callers can detect the case.

## License

MIT
