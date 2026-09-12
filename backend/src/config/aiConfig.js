export const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export function validateAIConfig() {
	if (!process.env.GROQ_API_KEY) {
		throw new Error("GROQ_API_KEY is not configured.");
	}
}
