/**
 * Standalone AI controller.
 *
 * Same AI services as the project flow, but exposed as flat
 * stateless endpoints for tooling, batch jobs, and integration
 * tests. They are rate-limited harder than the public API.
 */
import asyncHandler from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import roleAnalysisService from "../services/roleAnalysis.service.js";
import skillGapService from "../services/skillGap.service.js";
import blueprintService from "../services/blueprint.service.js";
import generatorService from "../services/generator.service.js";
import qualityCheckService from "../services/qualityCheck.service.js";
import { listTemplates } from "../data/templates.js";

export const analyzeRole = asyncHandler(async (req, res) => {
  const result = await roleAnalysisService.analyzeRole(req.body);
  ok(res, result);
});

export const analyzeSkillGap = asyncHandler(async (req, res) => {
  const result = await skillGapService.analyzeSkillGap(req.body);
  ok(res, result);
});

export const buildBlueprint = asyncHandler(async (req, res) => {
  const result = await blueprintService.buildBlueprint(req.body);
  ok(res, result);
});

export const generate = asyncHandler(async (req, res) => {
  const result = await generatorService.generateResume(req.body);
  ok(res, result);
});

export const qualityCheck = asyncHandler(async (req, res) => {
  const result = await qualityCheckService.runQualityCheck(req.body);
  ok(res, result);
});

export const templates = asyncHandler(async (_req, res) => {
  ok(res, { templates: listTemplates() });
});
