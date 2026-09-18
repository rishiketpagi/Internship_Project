import "dotenv/config";
import Groq from "groq-sdk";
import roleAnalysisSchema from "../data/roleAnalysisSchema.json" with { type: "json" };
import { roleAnalysisSystemPrompt } from "../prompts/roleAnalysisPrompt.js";
import { groqModel } from "../config/aiConfig.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyze a user's extracted resume against a target role and
 * optional job description.
 *
 * Returns an object that follows `roleAnalysisSchema.json`. The
 * downstream `resumeGenerator` consumes this to decide which
 * existing resume items to surface.
 */
export async function analyzeRole(resumeData, targetRole, jobDescription) {
    const userInput = JSON.stringify({
        targetRole,
        jobDescription: jobDescription || "",
        resumeData,
    });

    const completion = await groq.chat.completions.create({
        model: groqModel,
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
