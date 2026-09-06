/**
 * PDF text extraction using pdf-parse library.
 * 
 * pdf-parse is a Node.js library for extracting text from PDF files.
 * It handles compressed streams, filters, and other PDF constructs.
 * 
 * @see https://www.npmjs.com/package/pdf-parse
 */
"use strict";

const pdfParse = require("pdf-parse");

/**
 * Extract text from a PDF file buffer using pdf-parse.
 * @param {Buffer} fileBuffer - The PDF file buffer
 * @returns {string} Extracted text content
 */
async function extractTextFromPDF(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);

    // pdf-parse returns text content; ensure it's a string
    const text = data.text || "";

    // pdf-parse already extracts proper text; minimal cleanup
    const cleaned = text.replace(/\s+/g, " ").trim();

    return cleaned.length > 0 ? cleaned : "";
  } catch (error) {
    console.error("PDF parse error:", error);
    // Fallback to basic extraction if pdf-parse fails
    const text = fileBuffer.toString("utf-8", 0, fileBuffer.length);
    const cleaned = text.replace(/[\x00-\x1f\x7f-\x9f]/g, " ");
    const lines = cleaned.split("\n").filter(line => line.length > 3);
    return lines.slice(0, 10).join(" ") || "";
  }
}

module.exports = { extractTextFromPDF };