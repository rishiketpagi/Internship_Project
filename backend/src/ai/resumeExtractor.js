import Groq from "groq-sdk";
import resumeSchema from "../data/resumeSchema.json" with { type: "json" };
import { extractionSystemPrompt } from "../prompts/extractionPrompt.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function extractResumeData(text) {
    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL,

        messages: [
            {
                role: "system",
                content: extractionSystemPrompt,
            },
            {
                role: "user",
                content: text,
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

    return JSON.parse(result);
}