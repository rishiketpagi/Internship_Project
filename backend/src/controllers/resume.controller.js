/**
 * Resume extraction controller.
 *
 * Two entry points:
 *   POST /extract-resume           — JSON body { text } or multipart file
 *   POST /api/extract/text         — JSON body { text }
 *   POST /api/extract/file         — multipart file (field "resume")
 *
 * The first one is preserved for the existing frontend's
 * compatibility; the second pair is the RESTier version the
 * rest of the API is built on.
 */
import asyncHandler from "../utils/asyncHandler.js";
import { ok, fail } from "../utils/response.js";
import { HttpError } from "../utils/httpError.js";
import extractorService from "../services/extractor.service.js";
import { extractTextFromPDF } from "../parsers/pdfParser.js";
import { extractTextFromDOCX } from "../parsers/docxParser.js";

const extractFromTextPayload = async (text) => {
  if (!text || !text.trim()) {
    throw new HttpError(400, "Field 'text' must be a non-empty string", {
      code: "EMPTY_TEXT",
    });
  }
  return extractorService.extractResumeFromText(text);
};

const extractFromFilePayload = async (file) => {
  if (!file) {
    throw new HttpError(400, "No file uploaded. Use the 'resume' field name.", {
      code: "NO_FILE",
    });
  }
  const mime = (file.mimetype || "").toLowerCase();
  let text;
  if (mime === "application/pdf") {
    text = await extractTextFromPDF(file.buffer);
  } else if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    (file.originalname || "").toLowerCase().endsWith(".docx")
  ) {
    text = await extractTextFromDOCX(file.buffer);
  } else {
    throw new HttpError(415, "Only PDF and DOCX files are supported.", {
      code: "UNSUPPORTED_MEDIA_TYPE",
      details: { mimetype: file.mimetype, filename: file.originalname },
    });
  }
  if (!text || !text.trim()) {
    throw new HttpError(422, "Could not extract any text from the uploaded file.", {
      code: "EMPTY_TEXT",
    });
  }
  return extractorService.extractResumeFromText(text);
};

export const extractFromText = asyncHandler(async (req, res) => {
  const resume = await extractFromTextPayload(req.body?.text);
  ok(res, {
    source: "text",
    extractedLength: req.body.text.length,
    resume,
  });
});

export const extractFromFile = asyncHandler(async (req, res) => {
  const resume = await extractFromFilePayload(req.file);
  ok(res, {
    source: "file",
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
    resume,
  });
});

// Backwards-compatible endpoint used by the existing frontend.
export const extractResume = asyncHandler(async (req, res) => {
  let resume;
  let source;
  if (req.file) {
    resume = await extractFromFilePayload(req.file);
    source = "file";
  } else if (typeof req.body?.text === "string" && req.body.text.trim()) {
    resume = await extractFromTextPayload(req.body.text);
    source = "text";
  } else {
    return fail(
      res,
      400,
      "EMPTY_INPUT",
      "Provide either a 'text' field or a 'resume' file upload."
    );
  }
  ok(res, { source, resume });
});
