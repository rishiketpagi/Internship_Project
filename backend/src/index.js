import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";

import { extractTextFromPDF } from "./parsers/pdfParser.js";
import { extractTextFromDOCX } from "./parsers/docxParser.js";
import { extractTextFromImage } from "./parsers/imageParser.js";

import { extractResumeData } from "./ai/resumeExtractor.js";
import { generateRoleSpecificResume } from "./ai/resumeGenerator.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "1mb" }));
app.use("/api/resumes", resumeRoutes);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

app.post("/extract-resume", upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescriptionImage", maxCount: 1 },
]), async (req, res) => {
    try {
        let extractedText = "";

        const targetRole = req.body.targetRole;
        let jobDescription = req.body.jobDescription?.trim() || "";
        const resumeFile = req.files?.resume?.[0];
        const jobDescriptionImage = req.files?.jobDescriptionImage?.[0];

        if (!targetRole) {
            return res.status(400).json({
                success: false,
                message: "Please select a target role.",
            });
        }

        // -------------------------
        // TEXT INPUT
        // -------------------------
        if (req.body.text) {
            extractedText = req.body.text;
        }

        // -------------------------
        // FILE INPUT
        // -------------------------
        else if (resumeFile) {
            const file = resumeFile;

            if (file.mimetype === "application/pdf") {
                extractedText = await extractTextFromPDF(file.buffer);
            }

            else if (
                file.mimetype ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                extractedText = await extractTextFromDOCX(file.buffer);
            }

            else if (file.mimetype.startsWith("image/")) {
                extractedText = await extractTextFromImage(file.buffer);
            }

            else {
                return res.status(400).json({
                    success: false,
                    message: "Only PDF, DOCX, PNG, JPG, and WEBP files are supported.",
                });
            }

        }

        else {
            return res.status(400).json({
                success: false,
                message: "Please provide text or upload a PDF/DOCX file.",
            });
        }

        if (jobDescriptionImage) {
            if (!jobDescriptionImage.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    success: false,
                    message: "The job description upload must be an image.",
                });
            }

            const imageText = await extractTextFromImage(jobDescriptionImage.buffer);
            jobDescription = [jobDescription, imageText.trim()]
                .filter(Boolean)
                .join("\n\n");
        }

        // -------------------------
        // EMPTY INPUT
        // -------------------------
        if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({
                success: false,
                message: "No text could be extracted from the input.",
            });
        }

        // -------------------------
        // AI PIPELINE
        // -------------------------

        const resumeData = await extractResumeData(extractedText.trim());

        const roleResumeData = await generateRoleSpecificResume(
            resumeData,
            targetRole,
            jobDescription
        );

        // -------------------------
        // RESPONSE
        // -------------------------

        res.json({
            success: true,
            targetRole,
            resumeData,
            roleResumeData,
        });

        console.log("Resume extraction completed successfully.");

    } catch (error) {
        console.error("Resume extraction error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to extract resume information.",
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});