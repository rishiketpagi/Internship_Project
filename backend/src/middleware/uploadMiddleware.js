import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

export const uploadFields = upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescriptionImage", maxCount: 1 },
]);
