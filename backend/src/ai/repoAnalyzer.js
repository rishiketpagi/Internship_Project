import Groq from "groq-sdk";
import githubProjectSchema from "../data/githubProjectSchema.json" with { type: "json" };

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const systemPrompt = `You are an expert technical resume writer. 
Your task is to analyze a GitHub repository's metadata and README file to generate a professional, resume-ready project entry.
Focus on the technical accomplishments, core features, architecture, and the primary technologies used.
Output the description in a clear, concise professional tone. Use bullet points (•) for the description to make it easy to read on a resume.
Do not include generic fluff. Focus on action verbs and technical details.`;

export async function analyzeGithubRepo(repoData, readmeContent) {
    // Truncate README if it's too long to save tokens, e.g. keep first 10000 characters
    const truncatedReadme = readmeContent ? readmeContent.substring(0, 10000) : "No README provided.";
    
    const userInput = JSON.stringify({
        repositoryName: repoData.name,
        repositoryDescription: repoData.description || "",
        languages: repoData.languages || [],
        readme: truncatedReadme
    });

    try {
        const completion = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userInput,
                },
            ],
            temperature: 0.2,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "github_project_analysis",
                    strict: true,
                    schema: githubProjectSchema,
                },
            },
        });

        const result = completion.choices[0].message.content;
        return JSON.parse(result);
    } catch (error) {
        console.error("Groq Analysis Error in repoAnalyzer:", error);
        throw new Error("Failed to analyze repository with AI.");
    }
}
