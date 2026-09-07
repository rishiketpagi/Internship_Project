/**
 * Joi schema for the quality-check endpoint.
 */
import Joi from "joi";
import { resumeSchema } from "./commonSchemas.js";

export const qualityCheckBody = Joi.object({
  sourceResume: resumeSchema.required(),
  generatedResume: Joi.object().required(),
});
