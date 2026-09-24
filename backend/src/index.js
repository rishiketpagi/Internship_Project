import express from "express";
import cors from "cors";
import "dotenv/config";

import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "1mb" }));
app.use("/api/resumes", resumeRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});