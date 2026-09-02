import mammoth from "mammoth";

export async function extractTextFromDOCX(buffer) {
    const result = await mammoth.extractRawText({
        buffer,
    });

    return result.value;
}