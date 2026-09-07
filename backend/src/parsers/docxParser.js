/**
 * DOCX text extraction.
 *
 * DOCX files are zipped XML; `mammoth` does a great job of
 * turning them into plain text or HTML. We use the plain-text
 * path because the downstream consumer is the AI extractor.
 */
import mammoth from "mammoth";

const MAX_CHARS = 50_000;
const MIN_TEXT_LENGTH = 10;

const clean = (text) =>
  (text || "")
    .replace(/ /g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ -]+/g, "")
    .trim();

export async function extractTextFromDOCX(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("extractTextFromDOCX: a Buffer is required");
  }
  let raw = "";
  try {
    const result = await mammoth.extractRawText({ buffer });
    raw = result?.value || "";
  } catch (err) {
    const error = new Error("Unable to parse DOCX — file may be corrupted or password-protected.");
    error.code = "DOCX_PARSE_FAILED";
    error.cause = err;
    throw error;
  }

  const cleaned = clean(raw);
  if (cleaned.length < MIN_TEXT_LENGTH) {
    const error = new Error("DOCX contains no extractable text.");
    error.code = "DOCX_EMPTY_TEXT";
    throw error;
  }
  return cleaned.slice(0, MAX_CHARS);
}

export const _clean = clean;
export default extractTextFromDOCX;
