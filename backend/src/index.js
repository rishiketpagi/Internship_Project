const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv/config");

const { extractTextFromPDF } = require("./parsers/pdfParser.js");
const { extractTextFromDOCX } = require("./parsers/docxParser.js");
const { extractResumeData } = require("./ai/resumeExtractor.js");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// ===== ROUTE: POST /extract-resume =====
app.post(
  "/extract-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      let extractedText = "";

      // TEXT INPUT
      if (req.body.text) {
        extractedText = req.body.text;
      }

      // FILE INPUT
      else if (req.file) {
        const file = req.file;

        if (file.mimetype === "application/pdf") {
          extractedText = await extractTextFromPDF(file.buffer);
        } else if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          extractedText = await extractTextFromDOCX(file.buffer);
        } else {
          return res.status(400).json({
            success: false,
            message: "Only PDF and DOCX files are supported.",
          });
        }

        console.log("Extracted text from file:");
        console.log(extractedText);
      }

      // NO INPUT
      else {
        return res.status(400).json({
          success: false,
          message: "Please provide text or upload a PDF/DOCX file.",
        });
      }

      // EMPTY INPUT
      if (!extractedText || !extractedText.trim()) {
        return res.status(400).json({
          success: false,
          message: "No text could be extracted from the input.",
        });
      }

      // EXTRACT STRUCTURED DATA USING AI
      let schemaData;
      try {
        schemaData = await extractResumeData(extractedText);
        // Validate that we got proper structured data
        if (
          !schemaData ||
          !schemaData.personalInfo ||
          !Array.isArray(schemaData.workExperience)
        ) {
          throw new Error("Invalid AI response structure");
        }
      } catch (aiError) {
        console.error("AI extraction error:", aiError);
        return res.status(500).json({
          success: false,
          message: "Failed to extract resume information via AI.",
        });
      }

      res.json({
        success: true,
        extractedText: extractedText.trim(),
        schemaData,
        sourceReference: {},
      });
    } catch (error) {
      console.error("Resume extraction error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to extract resume information.",
      });
    }
  }
);

// ===== SIMPLE ROUTE: CREATE RESUME PROJECT =====
app.post("/api/projects", async (req, res) => {
  try {
    const { targetRole, jobDescription } = req.body;
    res.json({
      success: true,
      data: { projectId: `proj_${Date.now()}`, targetRole, jobDescription },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create resume project",
    });
  }
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ===== ROOT =====
app.get("/", (req, res) => {
  res.json({ message: "Resume Generator Backend API" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});