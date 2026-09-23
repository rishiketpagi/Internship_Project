import Groq from "groq-sdk";
import atsScoreSchema from "../data/atsScoreSchema.json" with { type: "json" };
import { atsAnalysisSystemPrompt } from "../prompts/atsAnalysisPrompt.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Maximum allowed value for each scoring category.
const CATEGORY_CAPS = {
    keywordMatch: 30,
    relevantSkills: 25,
    resumeStructure: 15,
    experienceRelevance: 15,
    formatting: 10,
    completeness: 5,
};

/**
 * Normalize a keyword string for deduplication and comparison.
 * Lowercases, trims, and strips trailing dots / slashes.
 */
function normalizeKeyword(keyword) {
    return keyword
        .toLowerCase()
        .trim()
        .replace(/[.\-/]+$/g, "")
        .replace(/\.js$/g, "js");
}

/**
 * Remove duplicates from an array of keyword strings (case-insensitive).
 * Keeps the first occurrence's original casing.
 */
function deduplicateKeywords(keywords) {
    const seen = new Set();
    const result = [];

    for (const keyword of keywords) {
        const normalized = normalizeKeyword(keyword);
        if (normalized && !seen.has(normalized)) {
            seen.add(normalized);
            result.push(keyword);
        }
    }

    return result;
}

/**
 * Run deterministic backend checks on the resume to adjust scores
 * that the AI might have evaluated incorrectly.
 */
function checkCompleteness(candidateProfile) {
    let penalty = 0;

    if (!candidateProfile.professionalSummary?.trim()) penalty += 2;
    if (!candidateProfile.education?.length) penalty += 1;
    if (!candidateProfile.skills?.length) penalty += 1;
    if (!candidateProfile.workExperience?.length && !candidateProfile.projects?.length) penalty += 1;

    return penalty;
}

/**
 * Validate and sanitize the AI-generated ATS analysis.
 * - Clamps each category to its allowed maximum.
 * - Recalculates overallScore as the sum of categories.
 * - Deduplicates keywords.
 * - Removes any keyword that appears in both matched and missing.
 * - Ensures the disclaimer is always present.
 */
function validateAnalysis(analysis, candidateProfile) {
    const categories = { ...analysis.categories };

    // Clamp each category
    for (const [key, max] of Object.entries(CATEGORY_CAPS)) {
        const raw = typeof categories[key] === "number" ? categories[key] : 0;
        categories[key] = Math.max(0, Math.min(raw, max));
    }

    // Apply deterministic completeness adjustment
    const completenessPenalty = checkCompleteness(candidateProfile);
    categories.completeness = Math.max(0, categories.completeness - completenessPenalty);

    // Recalculate overall score from validated categories
    const overallScore = Object.values(categories).reduce((sum, score) => sum + score, 0);

    // Deduplicate keywords
    let matchedKeywords = deduplicateKeywords(analysis.matchedKeywords || []);
    let missingKeywords = deduplicateKeywords(analysis.missingKeywords || []);

    // Remove any keyword from missing if it already appears in matched
    const matchedSet = new Set(matchedKeywords.map(normalizeKeyword));
    missingKeywords = missingKeywords.filter(
        (keyword) => !matchedSet.has(normalizeKeyword(keyword))
    );

    return {
        overallScore: Math.max(0, Math.min(100, overallScore)),
        scoreLabel: "Estimated ATS Compatibility",
        categories,
        matchedKeywords,
        missingKeywords,
        strengths: analysis.strengths || [],
        suggestions: analysis.suggestions || [],
        disclaimer:
            "This score is an estimate based on ResumeAI's evaluation criteria. Actual ATS results may vary depending on the employer's system.",
    };
}

/**
 * Analyze a generated resume for ATS compatibility.
 *
 * @param {object} generatedResume — The full roleResumeData object
 *        (contains targetRole, jobDescription, candidateProfile).
 * @param {string} targetRole — The target job role.
 * @param {string} jobDescription — Optional job description text.
 * @returns {Promise<object>} Validated ATS analysis result.
 */
export async function analyzeResumeATS(generatedResume, targetRole, jobDescription) {
    const candidateProfile = generatedResume.candidateProfile || generatedResume;

    const userInput = JSON.stringify({
        targetRole,
        jobDescription: jobDescription || "",
        resume: candidateProfile,
    });

    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL,

        messages: [
            {
                role: "system",
                content: atsAnalysisSystemPrompt,
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
                name: "ats_analysis",
                strict: true,
                schema: atsScoreSchema,
            },
        },
    });

    const result = completion.choices[0].message.content;
    const analysis = JSON.parse(result);

    return validateAnalysis(analysis, candidateProfile);
}
