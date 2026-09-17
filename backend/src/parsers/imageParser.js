import { createWorker } from "tesseract.js";

export async function extractTextFromImage(fileBuffer) {
    const worker = await createWorker("eng");

    try {
        const result = await worker.recognize(fileBuffer);
        return result.data.text;
    } finally {
        await worker.terminate();
    }
}
