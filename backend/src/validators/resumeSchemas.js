/**
 * Joi schemas for the /extract-resume family of endpoints.
 */
import Joi from "joi";
import { nonEmptyString, longString, resumeSchema } from "./commonSchemas.js";

export const extractFromTextBody = Joi.object({
  text: longString.required(),
  // Optional pre-extracted resume to skip the AI call (useful
  // when the frontend already has structured data and wants
  // normalization / re-extraction).
  resume: resumeSchema.optional(),
});

export const extractFromFileBody = Joi.object({
  // No body when uploading a file; multer populates req.file.
}).unknown(true);
