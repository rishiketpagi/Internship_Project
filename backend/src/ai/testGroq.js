import "dotenv/config";
import Groq from "groq-sdk";
import fs from "fs/promises";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const resumeText = await fs.readFile(
    "src/data/sample.txt",
    "utf-8"
);

const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
        {
            role: "system",
            content: `
You are a resume information extraction system.

Extract only information explicitly provided in the resume text.

Never invent or assume information.

Return ONLY valid JSON with these fields:

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "professionalSummary": "",
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
      `,
        },
        {
            role: "user",
            content: resumeText,
        },
    ],
    temperature: 0,
});

const result = completion.choices[0].message.content;

console.log("AI RESPONSE:");
console.log(result);