import { extractTextFromPDF } from "../parsers/pdfParser.js";
import { extractTextFromDOCX } from "../parsers/docxParser.js";
import { extractTextFromImage } from "../parsers/imageParser.js";
import { extractResumeData } from "../ai/resumeExtractor.js";
import { generateRoleSpecificResume } from "../ai/resumeGenerator.js";
import { analyzeResumeATS } from "../ai/atsAnalyzer.js";
import { generateDocxBuffer } from "../services/docxService.js";

export const extractResume = async (req, res) => {
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
            } else if (
                file.mimetype ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                extractedText = await extractTextFromDOCX(file.buffer);
            } else if (file.mimetype.startsWith("image/")) {
                extractedText = await extractTextFromImage(file.buffer);
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Only PDF, DOCX, PNG, JPG, and WEBP files are supported.",
                });
            }
        } else {
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
        // ATS ANALYSIS (non-blocking)
        // -------------------------

        let atsAnalysis = null;
        let atsAnalysisError;

        try {
            atsAnalysis = await analyzeResumeATS(
                roleResumeData,
                targetRole,
                jobDescription
            );
            console.log("ATS analysis completed successfully.");
        } catch (atsError) {
            console.error("ATS analysis failed (resume still returned):", atsError.message);
            atsAnalysisError = "ATS analysis is temporarily unavailable.";
        }

        // -------------------------
        // RESPONSE
        // -------------------------

        res.json({
            success: true,
            targetRole,
            jobDescription: jobDescription || "",
            resumeData,
            roleResumeData,
            atsAnalysis,
            atsAnalysisError,
        });

        console.log("Resume extraction completed successfully.");

    } catch (error) {
        console.error("Resume extraction error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to extract resume information.",
        });
    }
};

export const generateDocx = async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData || typeof resumeData !== "object") {
            return res.status(400).json({
                success: false,
                message: "resumeData is required and must be an object.",
            });
        }

        const buffer = await generateDocxBuffer(resumeData);

        // Derive a safe filename from the candidate's name
        const rawName = resumeData.personalInfo?.name || "Resume";
        const safeName = rawName.trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
        const filename = `${safeName}_Resume.docx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(buffer);
    } catch (error) {
        console.error("DOCX generation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate DOCX file.",
        });
    }
};

export const analyzeAts = async (req, res) => {
    try {
        const { resumeData, targetRole, jobDescription } = req.body;

        if (!resumeData || typeof resumeData !== "object") {
            return res.status(400).json({
                success: false,
                message: "resumeData is required and must be an object.",
            });
        }
        
        const roleToAnalyze = targetRole || "General Role";

        const atsAnalysis = await analyzeResumeATS(
            { candidateProfile: resumeData },
            roleToAnalyze,
            jobDescription || ""
        );

        res.json({
            success: true,
            atsAnalysis,
        });
    } catch (error) {
        console.error("ATS re-analysis error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze ATS compatibility.",
        });
    }
};
