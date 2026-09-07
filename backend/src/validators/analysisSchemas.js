/**
 * Joi schemas for the standalone /api/ai/* endpoints.
 */
import Joi from "joi";
import { nonEmptyString, longString, resumeSchema } from "./commonSchemas.js";

export const roleAnalysisBody = Joi.object({
  role: nonEmptyString.required(),
  jobDescription: longString.optional().allow(""),
  resume: resumeSchema.required(),
});

export const skillGapBody = Joi.object({
  role: nonEmptyString.required(),
  jobDescription: longString.optional().allow(""),
  resume: resumeSchema.required(),
});

export const blueprintBody = Joi.object({
  role: nonEmptyString.required(),
  jobDescription: longString.optional().allow(""),
  resume: resumeSchema.required(),
  roleAnalysis: Joi.object().optional(),
  skillGap: Joi.object().optional(),
});

export const generatorBody = Joi.object({
  role: nonEmptyString.required(),
  jobDescription: longString.optional().allow(""),
  resume: resumeSchema.required(),
  blueprint: Joi.object().required(),
});
