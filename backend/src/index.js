// Local development entry point.
// For serverless / Vercel, see ./api/index.js.
import "dotenv/config";
import app from "./app.js";
import { validateAIConfig } from "./config/aiConfig.js";

const PORT = process.env.PORT || 5000;

try {
    validateAIConfig();
} catch (error) {
    console.error(`AI configuration error: ${error.message}`);
}

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
