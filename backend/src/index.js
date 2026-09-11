import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";

import { extractTextFromPDF } from "./parsers/pdfParser.js";
import { extractTextFromDOCX } from "./parsers/docxParser.js";

import { extractResumeData } from "./ai/resumeExtractor.js";
import { generateRoleSpecificResume } from "./ai/resumeGenerator.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resumes", resumeRoutes);

const upload = multer({
    storage: multer.memoryStorage(),
});

app.post("/extract-resume", upload.single("resume"), async (req, res) => {
    try {
        let extractedText = "";

        const targetRole = req.body.targetRole;
        const jobDescription = req.body.jobDescription?.trim() || "";

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
        else if (req.file) {
            const file = req.file;

            if (file.mimetype === "application/pdf") {
                extractedText = await extractTextFromPDF(file.buffer);
            }

            else if (
                file.mimetype ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                extractedText = await extractTextFromDOCX(file.buffer);
            }

            else {
                return res.status(400).json({
                    success: false,
                    message: "Only PDF and DOCX files are supported.",
                });
            }

            console.log("Extracted text from file:");
            console.log(extractedText);
        }

        // -------------------------
        // NO INPUT
        // -------------------------
        else {
            return res.status(400).json({
                success: false,
                message: "Please provide text or upload a PDF/DOCX file.",
            });
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
        console.log("Target Role:", targetRole);
        console.log("Resume Data:", resumeData);
        console.log("Role Resume Data:", roleResumeData);

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