import { Router } from "express";
import { generateDocxBuffer } from "../services/docxService.js";
import { analyzeResumeATS } from "../ai/atsAnalyzer.js";

const router = Router();

/**
 * POST /api/resumes/generate-docx
 * Body: { resumeData: { ... } }
 * Returns the generated .docx file as a download.
 */
router.post("/generate-docx", async (req, res) => {
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
});

/**
 * POST /api/resumes/analyze-ats
 * Body: { resumeData: { ... }, targetRole: "...", jobDescription: "..." }
 * Returns the ATS analysis result.
 */
router.post("/analyze-ats", async (req, res) => {
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
});

export default router;
