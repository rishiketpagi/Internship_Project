# Resume Generator — Developer Setup Guide

## 1. Project Overview

The Resume Generator is a full-stack web application that helps users create professional, job-specific resumes from:

- Raw text / achievement data
- Existing PDF resumes
- Existing DOCX resumes

The application will extract information, structure it, analyze it against a target job role, generate a factual resume, allow editing/customization, and export the final resume as PDF.

## 2. Project Architecture

The project is divided into two main applications:

```text
resume-generator/
├── frontend/       # React + Vite
├── backend/        # Node.js + Express + AI + document parsing + Firebase Admin
└── README.md
```

### Frontend

The frontend is responsible for:

- User interface
- Authentication screens
- Dashboard
- Resume input
- Resume editor
- Template selection
- Preview
- Calling backend APIs

### Backend

The backend is responsible for:

- REST APIs
- PDF/DOCX text extraction
- AI/Groq integration
- AI prompts
- Resume analysis
- Resume generation
- Firebase Admin operations
- Authentication verification
- Server-side validation

Firebase is treated as infrastructure used by the backend rather than as a separate application folder.

## 3. Frontend Structure

```text
frontend/
└── src/
    ├── components/
    │   ├── common/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── input/
    │   │   ├── ResumeTextInput.jsx
    │   │   └── ResumeFileUpload.jsx
    │   ├── extraction/
    │   ├── role/
    │   ├── analysis/
    │   ├── resume/
    │   └── templates/
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── SignIn.jsx
    │   ├── SignUp.jsx
    │   ├── Dashboard.jsx
    │   ├── DataInput.jsx
    │   └── NotFound.jsx
    │
    ├── services/
    ├── hooks/
    ├── context/
    ├── utils/
    ├── data/
    ├── firebase/
    ├── styles/
    ├── App.jsx
    └── main.jsx
```

Current routes:

```text
/              → Home
/signin        → SignIn
/signup        → SignUp
/dashboard     → Dashboard
/create        → DataInput
*              → NotFound
```

## 4. Backend Structure

```text
backend/
├── src/
│   ├── ai/
│   │   ├── resumeExtractor.js
│   │   ├── roleAnalyzer.js
│   │   └── resumeGenerator.js
│   │
│   ├── prompts/
│   │   ├── extractionPrompt.js
│   │   ├── roleAnalysisPrompt.js
│   │   └── resumeGenerationPrompt.js
│   │
│   ├── parsers/
│   │   ├── pdfParser.js
│   │   └── docxParser.js
│   │
│   ├── routes/
│   │   ├── resumeRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   ├── resumeService.js
│   │   ├── firebaseService.js
│   │   └── aiService.js
│   │
│   ├── config/
│   │   ├── firebaseAdmin.js
│   │   └── aiConfig.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── utils/
│   └── index.js
│
├── .env
├── .gitignore
└── package.json
```

Not every file above needs to be created immediately. Create files as the corresponding feature is implemented.

## 5. Required Software

Install:

- Node.js
- npm
- Git
- A code editor such as VS Code

Check Node/npm:

```bash
node -v
npm -v
```

## 6. Frontend Setup

From the project root:

```bash
npm create vite@latest frontend
```

Choose:

```text
Framework: React
Variant: JavaScript
```

Then:

```bash
cd frontend
npm install
npm install react-router-dom
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

## 7. Backend Setup

From the project root:

```bash
mkdir backend
cd backend
npm init -y
```

Install the backend dependencies:

```bash
npm install express cors multer pdf-parse mammoth firebase-admin dotenv
```

The backend uses ES modules. In `backend/package.json`, make sure this exists:

```json
"type": "module"
```

The development start script should be:

```json
"scripts": {
  "start": "node src/index.js"
}
```

Start the backend:

```bash
npm start
```

The development backend runs at:

```text
http://localhost:5000
```

## 8. Environment Variables

Create:

```text
backend/.env
```

Never commit this file.

Example:

```env
GROQ_API_KEY=your_groq_api_key
```

Other secrets/configuration may be added later.

Add `.env` and other secrets to `backend/.gitignore`.

## 9. Firebase

Firebase is used for application infrastructure such as:

- Authentication
- Firestore
- Storage

### Frontend Firebase

The React application can use the Firebase Web SDK for client-side Firebase features.

Keep frontend Firebase configuration separate from Admin SDK configuration.

### Backend Firebase

The backend uses:

```text
backend/src/config/firebaseAdmin.js
```

with the Firebase Admin SDK.

A Firebase service-account private key must never be committed to GitHub.

If using a local service-account JSON during development, add its filename to `.gitignore`.

## 10. Current Input Flow

The `/create` page allows the user to provide information in either way:

```text
                    DataInput
                   /         \
                  /           \
             Text input     PDF/DOCX
                │               │
                │            Upload
                │               │
                │        PDF/DOCX parser
                │               │
                └───────┬───────┘
                        ↓
                  Extracted Text
                        ↓
                       AI
                        ↓
              Structured Resume Data
```

The frontend components are:

```text
components/input/
├── ResumeTextInput.jsx
└── ResumeFileUpload.jsx
```

`DataInput.jsx` owns the input state and communicates with the backend.

## 11. Document Extraction

PDF/DOCX extraction happens on the backend.

### PDF

```text
PDF
 ↓
Multer Buffer
 ↓
pdf-parse
 ↓
Plain text
```

### DOCX

```text
DOCX
 ↓
Multer Buffer
 ↓
Mammoth
 ↓
Plain text
```

The extracted text is then passed to the AI layer.

The frontend should not contain PDF/DOCX parsing logic.

## 12. Backend API

The initial endpoint is:

```text
POST /extract-resume
```

It supports:

### Plain text

JSON body:

```json
{
  "text": "User's resume or achievement information..."
}
```

### PDF/DOCX

Multipart form data:

```text
resume = uploaded PDF/DOCX file
```

The backend should normalize both input types into:

```text
extractedText
```

before sending the content to AI.

## 13. AI Architecture

AI calls must happen on the backend.

Do NOT do:

```text
React → Groq
```

Use:

```text
React → Backend → Groq
```

This keeps the API key private.

Recommended backend organization:

```text
backend/src/
├── ai/
│   └── resumeExtractor.js
│
└── prompts/
    └── extractionPrompt.js
```

The AI pipeline is:

```text
Raw text / extracted document text
                ↓
        extraction prompt
                ↓
             Groq API
                ↓
        Structured JSON
```

The extraction AI must follow the project's factuality requirement:

- Use only information provided by the user.
- Never invent qualifications.
- Never invent companies.
- Never invent dates.
- Never invent skills.
- Never invent achievements.
- Missing information should remain empty rather than being fabricated.

## 14. Target Resume Data

The extracted result should eventually follow a consistent structure similar to:

```json
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "education": [],
  "workExperience": [],
  "internships": [],
  "projects": [],
  "skills": [],
  "certifications": [],
  "achievements": [],
  "awards": [],
  "hackathons": [],
  "volunteerExperience": [],
  "publications": [],
  "courses": []
}
```

This schema may evolve as the project develops.

## 15. Development Order

Do not build everything simultaneously.

Recommended order:

```text
1. React/Vite setup
2. Routing
3. Data input UI
4. Text input
5. PDF/DOCX upload
6. Backend API
7. PDF/DOCX extraction
8. Test extracted text
9. Groq AI integration
10. Structured resume extraction
11. Extraction review/edit screen
12. Firebase persistence
13. Job role selection
14. Role-based analysis
15. Skill-gap analysis
16. Resume generation
17. Resume editor
18. Templates
19. Preview
20. PDF export
21. Authentication/authorization hardening
22. Testing
23. Deployment
```

## 16. Team Development

For two collaborators, divide responsibilities by application area where possible.

Example:

```text
Person 1
────────
frontend/
├── pages/
├── components/
├── styles/
└── frontend services


Person 2
────────
backend/
├── routes/
├── parsers/
├── ai/
├── prompts/
├── services/
└── Firebase Admin integration
```

Both collaborators should pull the latest changes before starting work:

```bash
git pull
```

Create a feature branch before significant work:

```bash
git checkout -b feature/feature-name
```

Commit changes with clear messages:

```bash
git add .
git commit -m "feat: add resume text input"
```

Then push the branch:

```bash
git push -u origin feature/feature-name
```

## 17. Security Rules

Never commit:

```text
.env
serviceAccountKey.json
API keys
private credentials
```

Never put the Groq API key in React frontend code.

Validate uploaded files on both frontend and backend.

Do not trust MIME type or file extension alone for production security.

## 18. Current Status

At the time this document was created:

- React + Vite frontend is set up.
- React Router is installed.
- Frontend routes are configured.
- DataInput page exists.
- Text input component exists.
- PDF/DOCX upload component exists.
- Express backend is set up.
- CORS and JSON parsing are configured.
- Multer is installed for file uploads.
- PDF extraction is implemented with `pdf-parse`.
- DOCX extraction is implemented with `mammoth`.
- The backend can normalize text/PDF/DOCX into extracted text.
- Groq AI integration is the next major backend step.

## 19. Running the Project

Use two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm start
```

Expected:

```text
Backend running on http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Expected:

```text
http://localhost:5173
```

Then open:

```text
http://localhost:5173/create
```

## 20. Important Principle

Keep responsibilities separated:

```text
Frontend
→ collect and display data

Backend
→ validate, process, extract, call AI, and expose APIs

Firebase
→ authentication, database, and storage infrastructure

AI
→ structure, analyze, and generate content based only on supplied information
```

The goal is to keep the codebase understandable, secure, testable, and easy for two developers to work on simultaneously.
