resume-generator/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── data/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
│
├── functions/
│   │
│   ├── src/
│   │   │
│   │   ├── index.js
│   │   │
│   │   ├── ai/
│   │   │   ├── extractInformation.js
│   │   │   ├── generateResume.js
│   │   │   ├── analyzeResume.js
│   │   │   ├── skillGapAnalysis.js
│   │   │   └── validateResume.js
│   │   │
│   │   ├── prompts/
│   │   │   ├── extractionPrompt.js
│   │   │   ├── resumePrompt.js
│   │   │   ├── analysisPrompt.js
│   │   │   └── skillGapPrompt.js
│   │   │
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── resumeService.js
│   │   │   └── documentService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── sanitizeInput.js
│   │   │   ├── validateOutput.js
│   │   │   └── constants.js
│   │   │
│   │   └── config/
│   │       └── firebaseAdmin.js
│   │
│   ├── package.json
│   └── .env
│
├── firestore.rules
├── storage.rules
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md