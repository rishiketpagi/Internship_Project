import Groq from "groq-sdk";
import { extractionSystemPrompt } from "../prompts/extractionPrompt.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function extractResumeData(text) {
    const completion = await groq.chat.completions.create({
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

        model: process.env.GROQ_MODEL,

        temperature: 0,
    });

    const result = completion.choices[0].message.content;

    return JSON.parse(result);
}