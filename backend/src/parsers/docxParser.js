/**
 * DOCX text extraction using mammoth (fallback: basic approach).
 * For production, replace with mammoth or a dedicated DOCX library.
 * 
 * DOCX is a zipped XML format. Real text extraction requires mammoth,
 * antiword, or a dedicated library.
 */
"use strict";

/**
 * Extract text from a DOCX file buffer.
 * @param {Buffer} buffer - The DOCX file buffer
 * @returns {string} Extracted text (basic fallback)
 */
async function extractTextFromDOCX(buffer) {
  try {
    // Basic approach: convert buffer to string
    // DOCX is XML-based; real text extraction requires mammoth, antiword, etc.
    const text = buffer.toString("utf-8", 0, buffer.length);
    
    // Remove control characters
    const cleaned = text.replace(/[\x00-\x1f\x7f-\x9f]/g, " ");
    
    // Return first substantial paragraph found
    const paragraphs = cleaned.split(/\r?\n/).filter(p => p.length > 5);
    if (paragraphs.length > 0) {
      return paragraphs[0].substring(0, 500);
    }
    
    return "";
  } catch (error) {
    console.error("DOCX extract error:", error);
    return "";
  }
}

module.exports = { extractTextFromDOCX };