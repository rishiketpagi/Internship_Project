/**
 * Project service — orchestrates the multi-step resume flow
 * and owns all the business rules that touch more than one
 * sub-service.
 */
import { projectRepository } from "../repositories/projectRepository.js";
import { versionRepository } from "../repositories/versionRepository.js";
import { exportJobRepository } from "../repositories/exportJobRepository.js";
import { sanitizeResume } from "../data/resumeSchema.js";
import { badRequest, notFound, assert, unauthorized } from "../utils/httpError.js";
import { RESUME_STATUS, EXPORT_STATUS } from "../config/constants.js";
import extractorService from "./extractor.service.js";
import roleAnalysisService from "./roleAnalysis.service.js";
import skillGapService from "./skillGap.service.js";
import blueprintService from "./blueprint.service.js";
import generatorService from "./generator.service.js";
import qualityCheckService from "./qualityCheck.service.js";
import pdfExportService from "./pdfExport.service.js";
import { logger } from "../config/logger.js";

const ownedOrThrow = async (id, user) => {
  const project = await projectRepository.getOrThrow(id);
  if (project.userId && user?.uid && project.userId !== user.uid) {
    throw unauthorized("You do not have access to this project");
  }
  return project;
};

export const projectService = {
  async createProject({ user, targetRole, jobDescription, resume }) {
    const project = await projectRepository.create({
      userId: user?.uid || null,
      targetRole: targetRole || null,
      jobDescription: jobDescription || "",
      status: RESUME_STATUS.DRAFT,
      resume: resume ? sanitizeResume(resume) : null,
    });
    return project;
  },

  async getProject(id, user) {
    return ownedOrThrow(id, user);
  },

  async listProjects(user) {
    if (!user?.uid) return projectRepository.listByUser(null);
    return projectRepository.listByUser(user.uid);
  },

  async setTargetRole(id, { role }, user) {
    assert(role, "role is required");
    const project = await ownedOrThrow(id, user);
    return projectRepository.update(id, { targetRole: role });
  },

  async setJobDescription(id, { jobDescription }, user) {
    assert(typeof jobDescription === "string", "jobDescription must be a string");
    const project = await ownedOrThrow(id, user);
    return projectRepository.update(id, { jobDescription });
  },

  async attachResume(id, { resume, rawText }, user) {
    if (!resume && !rawText) {
      throw badRequest("Either 'resume' or 'rawText' must be provided");
    }
    let finalResume = resume;
    if (!finalResume && rawText) {
      finalResume = await extractorService.extractResumeFromText(rawText);
    }
    const project = await ownedOrThrow(id, user);
    return projectRepository.update(id, {
      resume: sanitizeResume(finalResume),
      status: RESUME_STATUS.IN_REVIEW,
    });
  },

  async analyzeRole(id, { jobDescription }, user) {
    const project = await ownedOrThrow(id, user);
    if (!project.resume) {
      throw badRequest("Project has no resume — call attachResume first");
    }
    if (!project.targetRole) {
      throw badRequest("Project has no target role — call setTargetRole first");
    }
    const result = await roleAnalysisService.analyzeRole({
      role: project.targetRole,
      jobDescription: jobDescription || project.jobDescription,
      resume: project.resume,
    });
    return projectRepository.update(id, { roleAnalysis: result });
  },

  async analyzeSkillGap(id, { jobDescription }, user) {
    const project = await ownedOrThrow(id, user);
    if (!project.resume || !project.targetRole) {
      throw badRequest("Project needs a resume and target role first");
    }
    const result = await skillGapService.analyzeSkillGap({
      role: project.targetRole,
      jobDescription: jobDescription || project.jobDescription,
      resume: project.resume,
    });
    return projectRepository.update(id, { skillGap: result });
  },

  async createBlueprint(id, user) {
    const project = await ownedOrThrow(id, user);
    if (!project.resume || !project.targetRole) {
      throw badRequest("Project needs a resume and target role first");
    }
    const blueprint = await blueprintService.buildBlueprint({
      role: project.targetRole,
      jobDescription: project.jobDescription,
      resume: project.resume,
      roleAnalysis: project.roleAnalysis,
      skillGap: project.skillGap,
    });
    return projectRepository.update(id, { blueprint });
  },

  async generateResume(id, { jobDescription } = {}, user) {
    const project = await ownedOrThrow(id, user);
    if (!project.resume || !project.targetRole || !project.blueprint) {
      throw badRequest(
        "Project needs resume, target role, and blueprint before generation"
      );
    }
    const generated = await generatorService.generateResume({
      role: project.targetRole,
      jobDescription: jobDescription || project.jobDescription,
      resume: project.resume,
      blueprint: project.blueprint,
    });
    const quality = await qualityCheckService.runQualityCheck({
      sourceResume: project.resume,
      generatedResume: generated,
    });
    return projectRepository.update(id, {
      generatedResume: generated,
      qualityCheck: quality,
      status: RESUME_STATUS.GENERATED,
    });
  },

  async getQualityCheck(id, user) {
    const project = await ownedOrThrow(id, user);
    return project.qualityCheck;
  },

  async renderPreview(id, { templateId } = {}, user) {
    const project = await ownedOrThrow(id, user);
    if (!project.generatedResume) {
      throw badRequest("No generated resume yet — call generateResume first");
    }
    const html = pdfExportService.renderResumePreviewHTML(
      project.generatedResume,
      templateId || project.templateId
    );
    return { html };
  },

  async exportPDF(id, { templateId } = {}, user) {
    const project = await ownedOrThrow(id, user);
    if (!project.generatedResume) {
      throw badRequest("No generated resume yet — call generateResume first");
    }
    const job = await exportJobRepository.create({
      projectId: id,
      userId: user?.uid || null,
      type: "pdf",
      templateId: templateId || project.templateId,
    });

    try {
      const buffer = await pdfExportService.renderResumePDF(
        project.generatedResume,
        job.templateId
      );
      await exportJobRepository.update(job.id, {
        status: EXPORT_STATUS.COMPLETED,
        resultBytes: buffer.length,
      });
      await projectRepository.update(id, { status: RESUME_STATUS.EXPORTED });
      return { jobId: job.id, buffer, templateId: job.templateId };
    } catch (err) {
      logger.error({ err: { message: err.message } }, "pdf export failed");
      await exportJobRepository.update(job.id, {
        status: EXPORT_STATUS.FAILED,
        error: err.message,
      });
      throw err;
    }
  },

  async getExportJob(jobId, user) {
    const job = await exportJobRepository.getOrThrow(jobId);
    if (job.userId && user?.uid && job.userId !== user.uid) {
      throw unauthorized("You do not have access to this export job");
    }
    return job;
  },

  // ---- Versioning ----

  async listVersions(id, user) {
    const project = await ownedOrThrow(id, user);
    return versionRepository.listByProject(id);
  },

  async saveVersion(id, { content, templateId, label }, user) {
    const project = await ownedOrThrow(id, user);
    assert(content && typeof content === "object", "content is required");
    return versionRepository.create({
      projectId: id,
      userId: user?.uid || null,
      content,
      templateId: templateId || project.templateId,
      label: label || null,
    });
  },

  async getVersion(versionId, user) {
    const version = await versionRepository.get(versionId);
    if (!version) throw notFound("Resume version");
    await ownedOrThrow(version.projectId, user);
    return version;
  },
};

export default projectService;
