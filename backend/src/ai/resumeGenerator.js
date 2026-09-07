import "dotenv/config";
import Groq from "groq-sdk";
import resumeSchema from "../data/resumeSchema.json" with { type: "json" };
import { resumeGenerationSystemPrompt } from "../prompts/resumeGenerationPrompt.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateRoleSpecificResume(
    resumeData,
    targetRole,
    roleAnalysis
) {
    const userInput = JSON.stringify({
        targetRole,
        resumeData,
        roleAnalysis,
    });

    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL,

        messages: [
            {
                role: "system",
                content: resumeGenerationSystemPrompt,
            },
            {
                role: "user",
                content: userInput,
            },
        ],

        temperature: 0,

        response_format: {
            type: "json_schema",
            json_schema: {
                name: "role_specific_resume",
                strict: true,
                schema: resumeSchema,
            },
        },
    });

    const result = completion.choices[0].message.content;

    return JSON.parse(result);
}