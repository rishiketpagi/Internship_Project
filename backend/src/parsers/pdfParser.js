import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(fileBuffer) {
    const parser = new PDFParse({
        data: fileBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
}