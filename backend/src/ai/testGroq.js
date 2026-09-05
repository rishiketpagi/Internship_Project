import "dotenv/config";
import Groq from "groq-sdk";
import fs from "fs/promises";

import resumeSchema from "../data/resumeSchema.json" with { type: "json" };

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

Extract ONLY information explicitly provided in the resume text.

Never invent, assume, or infer information.

If information is missing, return an empty string or empty array.

The output must follow the provided JSON schema exactly.
    `,
        },
        {
            role: "user",
            content: resumeText,
        },
    ],

    temperature: 0,

    response_format: {
        type: "json_schema",
        json_schema: {
            name: "resume_data",
            strict: true,
            schema: resumeSchema,
        },
    },
});

const result = completion.choices[0].message.content;

console.log("AI RESPONSE:");
console.log(result);