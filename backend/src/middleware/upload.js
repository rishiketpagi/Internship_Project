/**
 * Multer-based file upload middleware.
 *
 * - Validates the MIME type and extension against an allow-list.
 * - Enforces a max file size (configurable via env).
 * - Streams files to memory because we only need to parse them
 *   in-process; nothing is ever written to disk by the API
 *   itself. (Cloud storage can be added later by swapping the
 *   storage engine.)
 */
import multer from "multer";
import path from "node:path";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import {
  SUPPORTED_UPLOAD_MIME_TYPES,
  SUPPORTED_UPLOAD_EXTENSIONS,
} from "../config/constants.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mimeOk = SUPPORTED_UPLOAD_MIME_TYPES.has(file.mimetype);
  const extOk = SUPPORTED_UPLOAD_EXTENSIONS.has(ext);

  // Accept the file if either the mime type OR the extension is on
  // the allow-list. Some browsers send application/octet-stream
  // for .docx — the extension check is the safety net.
  if (mimeOk || extOk) {
    return cb(null, true);
  }
  cb(
    new HttpError(415, "Unsupported file type. Only PDF and DOCX are accepted.", {
      code: "UNSUPPORTED_MEDIA_TYPE",
      details: { mimetype: file.mimetype, extension: ext },
    })
  );
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_UPLOAD_BYTES,
    files: 1,
  },
});

/**
 * Convenience wrapper used by routes that accept a single file
 * under the field name `resume` (or whatever field they prefer).
 */
export const uploadSingle = (fieldName = "resume") => upload.single(fieldName);

/**
 * Multer throws a MulterError("LIMIT_FILE_SIZE") when a file
 * exceeds the cap. The default error handler doesn't translate
 * it into a friendly 413, so we wrap the middleware in a
 * try/catch via a thin adapter.
 */
export const safeUploadSingle = (fieldName = "resume") => [
  uploadSingle(fieldName),
  (err, req, res, next) => {
    if (err && err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE") {
      return next(
        new HttpError(413, "Uploaded file is too large.", {
          code: "PAYLOAD_TOO_LARGE",
          details: { maxBytes: env.MAX_UPLOAD_BYTES },
        })
      );
    }
    next(err);
  },
];
