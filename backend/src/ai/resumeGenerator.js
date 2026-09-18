import "dotenv/config";
import Groq from "groq-sdk";
import roleResumeSchema from "../data/roleResumeSchema.json" with { type: "json" };
import { resumeGenerationSystemPrompt } from "../prompts/resumeGenerationPrompt.js";
import { groqModel } from "../config/aiConfig.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate a role-tailored resume from the user's structured resume
 * data plus the role analysis produced by `analyzeRole`.
 *
 * `jobDescription` is passed through verbatim and surfaced as the
 * `jobDescription` field in the response so the frontend can show
 * what was used.
 *
 * `roleAnalysis` is optional but recommended — when present, the
 * generator uses it to prioritize which existing items to surface.
 */
export async function generateRoleSpecificResume(
    resumeData,
    targetRole,
    jobDescription,
    roleAnalysis = null
) {
    const userInput = JSON.stringify({
        targetRole,
        jobDescription: jobDescription || "",
        resumeData,
        roleAnalysis,
    });

    const completion = await groq.chat.completions.create({
        model: groqModel,

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
                name: "role_resume",
                strict: true,
                schema: roleResumeSchema,
            },
        },
    });

    const result = completion.choices[0].message.content;
    const roleResumeData = JSON.parse(result);

    console.log("Generated role resume from resumeGenerator.js:");
    console.log(JSON.stringify(roleResumeData, null, 2));

    return roleResumeData;
}
