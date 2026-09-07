/**
 * Joi schemas for the /api/projects/* family of endpoints.
 */
import Joi from "joi";
import {
  nonEmptyString,
  mediumString,
  longString,
  resumeSchema,
  idSchema,
} from "./commonSchemas.js";

export const createProjectBody = Joi.object({
  targetRole: nonEmptyString.optional(),
  jobDescription: mediumString.optional().allow(""),
  resume: resumeSchema.optional(),
});

export const idParam = Joi.object({
  id: idSchema,
});

export const setTargetRoleBody = Joi.object({
  role: nonEmptyString.required(),
});

export const setJobDescriptionBody = Joi.object({
  jobDescription: longString.required().allow(""),
});

export const attachResumeBody = Joi.object({
  resume: resumeSchema.optional(),
  rawText: longString.optional(),
}).or("resume", "rawText");

export const analyzeBody = Joi.object({
  jobDescription: longString.optional().allow(""),
});

export const generateBody = Joi.object({
  jobDescription: longString.optional().allow(""),
});

export const saveVersionBody = Joi.object({
  content: Joi.object().required(),
  templateId: nonEmptyString.optional(),
  label: mediumString.optional().allow(""),
});

export const exportBody = Joi.object({
  templateId: nonEmptyString.optional(),
});
