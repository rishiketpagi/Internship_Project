# RoleResume

> **Your experience. The right role.**

RoleResume is an AI-powered resume generation web application that helps users create professional, role-specific resumes from information they already have.

Instead of creating a resume completely from scratch, users can upload an existing **PDF/DOCX resume** or provide their career information as text. RoleResume extracts and organizes the information, allows the user to select a target role, optionally provide a job description, and generates a tailored resume using only the information provided by the user.

The generated resume can then be edited, checked for estimated ATS compatibility, saved, and downloaded in **PDF or DOCX** format.

---

## Features

### Resume Creation

* Select a target job role before creating the resume.
* Option to create a **General Resume** without targeting a specific role.
* Upload an existing **PDF or DOCX resume**.
* Paste resume or career information as text.
* Add an optional job description for more targeted resume generation.
* AI-powered extraction of structured resume information.
* AI-powered role-specific resume generation.
* Prevents the AI from inventing unsupported qualifications, experience, skills, or achievements.

### Resume Editor

* Edit generated resumes section by section.
* Supports the following resume sections:

  * Personal Information
  * Professional Summary
  * Education
  * Work Experience
  * Projects
  * Skills
  * Certifications
  * Achievements
* Live resume preview.
* Switch between available resume templates.
* Save resume changes.

### Resume Templates

RoleResume currently provides three ATS-friendly templates:

* **Minimal**
* **Modern**
* **Professional**

Templates are designed to maintain a clean structure and readable formatting suitable for applicant tracking systems.

### ATS Compatibility Analysis

RoleResume provides an estimated ATS compatibility analysis based on factors such as:

* Keyword matching
* Relevant skills
* Resume structure
* Experience relevance
* Formatting and readability
* Resume completeness

The ATS analysis can provide:

* Estimated compatibility score
* Matched keywords
* Missing or unmentioned keywords
* Resume strengths
* Improvement suggestions

The ATS score is an estimate based on RoleResume's evaluation criteria and is not a guarantee of how a particular company's ATS will score the resume.

### Authentication

Users can work with resumes without immediately creating an account.

Authentication is provided through **Firebase Authentication** and is required when users want to save their work to their account.

### Resume Management

Authenticated users can:

* View saved resumes
* Continue editing resumes
* Download resumes
* Duplicate resumes
* Rename resumes
* Delete resumes

### Profile

Users can maintain their profile information, including:

* Name
* Email
* Phone
* Location
* LinkedIn
* GitHub
* Portfolio
* Additional user-provided information

### Export

Generated resumes can be downloaded as:

* PDF
* DOCX

### User Experience

* Responsive interface
* Reusable components
* Toast notifications
* Clean navigation
* Resume-focused dashboard
* Template previews
* Form validation and error handling

---

## Application Flow

```text
                    ┌─────────────────┐
                    │      Home       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Create Resume   │
                    └────────┬────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │     Select Role      │
                  │                      │
                  │ • Frontend Developer│
                  │ • Backend Developer │
                  │ • Full Stack        │
                  │ • Data Analyst      │
                  │ • UI/UX Designer    │
                  │ • General Resume    │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Add Information     │
                  │                      │
                  │ PDF / DOCX / Text    │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Job Description      │
                  │      Optional        │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ AI Resume Generation │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Resume Editor      │
                  │                      │
                  │ Edit + Preview       │
                  │ Change Template      │
                  └──────────┬───────────┘
                             │
                  ┌──────────┴───────────┐
                  ▼                      ▼
        ┌─────────────────┐    ┌──────────────────┐
        │ ATS Analysis    │    │ Download Resume  │
        └────────┬────────┘    │ PDF / DOCX       │
                 │             └──────────────────┘
                 ▼
        ┌─────────────────┐
        │ Improve Resume  │
        └─────────────────┘
```

---

## AI Processing Flow

RoleResume uses AI in two primary stages.

```text
User Input
    │
    ▼
PDF / DOCX / Text
    │
    ▼
Document Parsing
    │
    ▼
Resume Text
    │
    ▼
┌─────────────────────────┐
│ AI Resume Extraction    │
└────────────┬────────────┘
             │
             ▼
Structured Resume Data
             │
             │
             ├── Target Role
             │
             └── Job Description
                       │
                       ▼
             ┌───────────────────────┐
             │ AI Resume Generation  │
             └───────────┬───────────┘
                         │
                         ▼
              Role-Specific Resume
                         │
                         ▼
                   Resume Editor
```

The generation process is designed to use the user's supplied information as the source of truth.

For example, the AI should not create:

* An employer that was not provided
* A certification that was not provided
* A technology that was not mentioned
* Fake project achievements
* Unsupported work experience
* Invented metrics or results

The selected role and job description are used to determine how existing information should be organized and emphasized.

---

## Resume Data Structure

The application uses eight primary resume sections:

```text
Resume
│
├── Personal Information
├── Professional Summary
├── Education
├── Work Experience
├── Projects
├── Skills
├── Certifications
└── Achievements
```

This structure is shared between the resume extraction, generation, editing, template rendering, and export workflows.

---

## Technology Stack

### Frontend

* React
* Vite
* JavaScript / JSX
* React Router
* HTML/CSS
* Tailwind CSS where applicable

### Backend

* Node.js
* Express.js
* JavaScript / ESM
* Multer
* CORS
* dotenv

### AI

* Groq API
* Large Language Model based resume extraction and generation
* Structured JSON output

### Authentication & Database

* Firebase Authentication
* Firebase / Firestore
* Firebase Admin SDK

### Document Processing

* PDF parsing
* DOCX parsing
* PDF generation/export
* DOCX generation/export

---

## Project Structure

The project is divided into separate frontend and backend applications.

```text
RoleResume/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── input/
│   │   │   ├── resume/
│   │   │   └── templates/
│   │   │
│   │   ├── config/
│   │   │   ├── api.js
│   │   │   ├── appConfig.js
│   │   │   └── routes.js
│   │   │
│   │   ├── data/
│   │   │   ├── roles.js
│   │   │   └── templates.js
│   │   │
│   │   ├── firebase/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── CreateResume.jsx
│   │   │   ├── ResumeEditor.jsx
│   │   │   ├── ATSAnalysis.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyResumes.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Templates.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── resumeService.js
│   │   │   └── profileService.js
│   │   │
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── src/
│   │   ├── ai/
│   │   │   ├── resumeExtractor.js
│   │   │   ├── resumeGenerator.js
│   │   │   └── atsAnalyzer.js
│   │   │
│   │   ├── config/
│   │   │   ├── aiConfig.js
│   │   │   ├── firebase.js
│   │   │   └── firebaseAdmin.js
│   │   │
│   │   ├── data/
│   │   │   ├── resumeSchema.json
│   │   │   └── atsScoreSchema.json
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── parsers/
│   │   │   ├── pdfParser.js
│   │   │   └── docxParser.js
│   │   │
│   │   ├── prompts/
│   │   │   ├── resumeExtractionPrompt.js
│   │   │   ├── resumeGenerationPrompt.js
│   │   │   └── atsAnalysisPrompt.js
│   │   │
│   │   └── index.js
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

You will also need:

* A Firebase project
* A Groq API key

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd RoleResume
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

Do not commit `.env` or Firebase private credentials to Git.

---

## Firebase Configuration

Create a Firebase project and enable the services required by the application.

### Authentication

Enable the authentication providers used by the application, such as:

* Email/Password
* Google

### Firestore

Create a Firestore database for storing user profiles and saved resumes.

The frontend Firebase configuration should be placed in the project's Firebase configuration files.

---

## Running the Application

### Start the backend

From the `backend` directory:

```bash
npm start
```

The backend should run on:

```text
http://localhost:5000
```

### Start the frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will provide the local development URL, normally:

```text
http://localhost:5173
```

Open the URL in your browser.

---

## API Overview

The backend provides APIs for processing resumes and generating documents.

### Resume Extraction

```text
POST /extract-resume
```

Accepts either:

* Resume text
* PDF file
* DOCX file

The extracted content is converted into structured resume data.

### Resume Generation

The generation workflow receives:

```text
targetRole
jobDescription
resumeData
```

and returns a structured role-specific resume.

### DOCX Generation

```text
POST /api/resumes/generate-docx
```

Generates a downloadable DOCX version of the resume.

---

## Resume Generation Rules

RoleResume follows several important principles when generating resumes.

### Information Integrity

The application only uses information supplied by the user.

```text
User Information
       │
       ▼
   AI Analysis
       │
       ▼
Reorganized / Rewritten Information
       │
       ▼
Role-Specific Resume
```

The AI may improve wording and organization, but it should not create unsupported facts.

### Role Tailoring

The target role determines which relevant information should receive greater emphasis.

For example, a user's existing:

```text
Skills:
React
Node.js
Python
SQL
```

may be organized differently for different target roles.

The role changes the presentation and prioritization of existing information rather than creating new qualifications.

### Job Description

A job description is optional.

When provided, it can help identify relevant keywords and requirements for tailoring the resume.

However:

> A requirement appearing in a job description does not mean the user possesses that skill.

The system should distinguish between information present in the user's resume and requirements mentioned by the employer.

---

## ATS Analysis

The ATS analysis is designed as an estimated compatibility assessment rather than a universal ATS score.

Example categories include:

```text
Keyword Match          30 points
Relevant Skills        25 points
Resume Structure       15 points
Experience Relevance   15 points
Formatting             10 points
Completeness            5 points
                       ─────────
                        100 points
```

The analysis can identify:

```text
Matched Keywords
Missing / Unmentioned Keywords
Strengths
Suggestions
Estimated Compatibility Score
```

Users can return to the editor, make improvements, and run the analysis again.

---

## Authentication Flow

Authentication is intentionally not required at the beginning of the resume creation process.

```text
                    Create Resume
                         │
                         ▼
                  Generate Resume
                         │
                         ▼
                  Edit Resume
                         │
              ┌──────────┴──────────┐
              │                     │
          Not Logged In          Logged In
              │                     │
              ▼                     ▼
       Continue Editing        Save to Account
              │
              ▼
       Sign In / Sign Up
              │
              ▼
        Save Resume
```

This allows users to experience the main resume creation flow before deciding to create an account.

---

## Design Principles

RoleResume follows a simple set of UI principles:

* Clean and professional interface
* Resume-focused workflow
* Minimal unnecessary UI elements
* Clear primary actions
* Responsive layouts
* Reusable components
* Accessible form controls
* Consistent design tokens
* Subtle animations and interactions
* ATS-friendly resume layouts

The interface uses a light, modern visual style with restrained gradients, subtle shadows, and clean surfaces rather than excessive visual effects.

---

## Future Improvements

Potential future improvements include:

* More resume templates
* Additional job roles
* Job description keyword highlighting
* More detailed ATS analysis
* Resume version comparison
* Resume history
* Additional export formats
* Improved accessibility
* More customization options
* Job-specific resume versions
* Enhanced resume analytics

---

## Development Principles

When extending RoleResume:

1. Keep resume data structured and consistent.
2. Avoid duplicating project-wide configuration values.
3. Keep frontend and backend responsibilities separate.
4. Reuse existing components before creating new ones.
5. Keep AI output constrained to the defined schemas.
6. Never allow AI-generated information to become unsupported user claims.
7. Keep templates ATS-friendly.
8. Keep the user in control of the final resume content.

---

## Project Status

**Status:** Completed / Final Development

The current project includes:

* Resume creation workflow
* PDF/DOCX upload
* Text input
* AI resume extraction
* Role-based resume generation
* Job description-based tailoring
* Resume editor
* Multiple templates
* Firebase authentication
* User profiles
* Dashboard
* Saved resumes
* ATS analysis interface
* PDF export
* DOCX export
* Toast notifications
* Responsive UI

---

## Contributors

Developed as a group project with contributions across:

* Frontend development
* Backend development
* AI integration
* Resume processing
* Firebase integration
* UI/UX design
* Testing and debugging

---

## License

This project was developed as part of an academic/internship project.

Add an appropriate open-source license here if the repository is intended to be publicly distributed.
