import Groq from "groq-sdk";
import roleAnalysisSchema from "../data/roleAnalysisSchema.json" with { type: "json" };
import roles from "../data/roles.json" with { type: "json" };
import { roleAnalysisSystemPrompt } from "../prompts/roleAnalysisPrompt.js";
import "dotenv/config";
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeResumeForRole(resumeData, targetRole) {
    const roleRequirements = roles[targetRole];

    if (!roleRequirements) {
        throw new Error(`Unsupported target role: ${targetRole}`);
    }

    const userInput = JSON.stringify({
        targetRole,
        roleRequirements,
        resumeData,
    });

    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL,

        messages: [
            {
                role: "system",
                content: roleAnalysisSystemPrompt,
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
                name: "role_analysis",
                strict: true,
                schema: roleAnalysisSchema,
            },
        },
    });

    const result = completion.choices[0].message.content;

    return JSON.parse(result);
}