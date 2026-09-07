/**
 * Project controller.
 *
 * Thin layer over `projectService` — the only place HTTP
 * shapes (status codes, response envelopes) are set.
 */
import asyncHandler from "../utils/asyncHandler.js";
import { ok, created } from "../utils/response.js";
import projectService from "../services/project.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject({
    user: req.user,
    targetRole: req.body.targetRole,
    jobDescription: req.body.jobDescription,
    resume: req.body.resume,
  });
  created(res, { id: project.id, project });
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjects(req.user);
  ok(res, { projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProject(req.params.id, req.user);
  ok(res, { project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.getProject(req.params.id, req.user); // ownership check
  const { projectRepository } = await import("../repositories/projectRepository.js");
  await projectRepository.delete(req.params.id);
  res.status(204).send();
});

export const setTargetRole = asyncHandler(async (req, res) => {
  const project = await projectService.setTargetRole(
    req.params.id,
    { role: req.body.role },
    req.user
  );
  ok(res, { project });
});

export const setJobDescription = asyncHandler(async (req, res) => {
  const project = await projectService.setJobDescription(
    req.params.id,
    { jobDescription: req.body.jobDescription },
    req.user
  );
  ok(res, { project });
});

export const attachResume = asyncHandler(async (req, res) => {
  const project = await projectService.attachResume(
    req.params.id,
    { resume: req.body.resume, rawText: req.body.rawText },
    req.user
  );
  ok(res, { project });
});

export const analyzeRole = asyncHandler(async (req, res) => {
  const project = await projectService.analyzeRole(
    req.params.id,
    { jobDescription: req.body.jobDescription },
    req.user
  );
  ok(res, { project });
});

export const analyzeSkillGap = asyncHandler(async (req, res) => {
  const project = await projectService.analyzeSkillGap(
    req.params.id,
    { jobDescription: req.body.jobDescription },
    req.user
  );
  ok(res, { project });
});

export const createBlueprint = asyncHandler(async (req, res) => {
  const project = await projectService.createBlueprint(req.params.id, req.user);
  ok(res, { project });
});

export const generateResume = asyncHandler(async (req, res) => {
  const project = await projectService.generateResume(
    req.params.id,
    { jobDescription: req.body.jobDescription },
    req.user
  );
  ok(res, { project });
});

export const getQualityCheck = asyncHandler(async (req, res) => {
  const qc = await projectService.getQualityCheck(req.params.id, req.user);
  ok(res, { qualityCheck: qc });
});

export const renderPreview = asyncHandler(async (req, res) => {
  const { html } = await projectService.renderPreview(
    req.params.id,
    { templateId: req.query.template },
    req.user
  );
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export const exportPDF = asyncHandler(async (req, res) => {
  const { buffer, jobId, templateId } = await projectService.exportPDF(
    req.params.id,
    { templateId: req.body?.templateId || req.query.template },
    req.user
  );
  res.set("Content-Type", "application/pdf");
  res.set("Content-Disposition", `attachment; filename="resume-${req.params.id}.pdf"`);
  res.set("X-Export-Job-Id", jobId);
  res.set("X-Export-Template", templateId);
  res.send(buffer);
});

export const getExportJob = asyncHandler(async (req, res) => {
  const job = await projectService.getExportJob(req.params.jobId, req.user);
  ok(res, { job });
});

export const listVersions = asyncHandler(async (req, res) => {
  const versions = await projectService.listVersions(req.params.id, req.user);
  ok(res, { versions });
});

export const saveVersion = asyncHandler(async (req, res) => {
  const version = await projectService.saveVersion(
    req.params.id,
    {
      content: req.body.content,
      templateId: req.body.templateId,
      label: req.body.label,
    },
    req.user
  );
  created(res, { version });
});

export const getVersion = asyncHandler(async (req, res) => {
  const version = await projectService.getVersion(req.params.versionId, req.user);
  ok(res, { version });
});
