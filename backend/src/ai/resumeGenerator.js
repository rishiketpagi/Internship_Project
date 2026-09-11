import "dotenv/config";
import Groq from "groq-sdk";
import roleResumeSchema from "../data/roleResumeSchema.json" with { type: "json" };
import { resumeGenerationSystemPrompt } from "../prompts/resumeGenerationPrompt.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateRoleSpecificResume(
    resumeData,
    targetRole,
    jobDescription
) {
    const userInput = JSON.stringify({
        targetRole,
        jobDescription,
        resumeData,
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