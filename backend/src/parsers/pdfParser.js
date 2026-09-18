// Importing the inner module directly bypasses pdf-parse@1.1.1's
// index.js self-test (which tries to read a missing fixture file on
// module load and crashes on serverless).
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPDF(fileBuffer) {
    const data = await pdfParse(fileBuffer);
    return data.text;
}
