/**
 * Hand-written OpenAPI 3.1 spec for the API.
 *
 * Kept in code (instead of YAML) so the version stays in sync
 * with the rest of the project, and so that downstream tools
 * (e.g. test generators) can import the spec directly.
 */
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "./constants.js";

const errorResponse = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    error: {
      type: "object",
      properties: {
        code: { type: "string", example: "VALIDATION_ERROR" },
        message: { type: "string", example: "Request validation failed" },
        details: { type: "array" },
        requestId: { type: "string" },
      },
      required: ["code", "message"],
    },
  },
  required: ["success", "error"],
};

const okEnvelope = (dataSchemaName) => ({
  type: "object",
  properties: {
    success: { type: "boolean", example: true },
    data: { $ref: `#/components/schemas/${dataSchemaName}` },
    meta: { type: "object", additionalProperties: true },
  },
  required: ["success"],
});

const projectSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    userId: { type: ["string", "null"] },
    targetRole: { type: ["string", "null"] },
    jobDescription: { type: "string" },
    status: { type: "string", enum: ["draft", "in_review", "generated", "exported"] },
    resume: { type: "object", additionalProperties: true },
    roleAnalysis: { type: "object", additionalProperties: true },
    skillGap: { type: "object", additionalProperties: true },
    blueprint: { type: "object", additionalProperties: true },
    generatedResume: { type: "object", additionalProperties: true },
    qualityCheck: { type: "object", additionalProperties: true },
    templateId: { type: "string", default: "classic" },
    _createdAt: { type: "string", format: "date-time" },
    _updatedAt: { type: "string", format: "date-time" },
  },
  required: ["_id"],
};

const resumeSchema = {
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" },
        portfolio: { type: "string" },
      },
    },
    professionalSummary: { type: "string" },
    education: { type: "array", items: { type: "object" } },
    workExperience: { type: "array", items: { type: "object" } },
    internships: { type: "array", items: { type: "object" } },
    projects: { type: "array", items: { type: "object" } },
    skills: { type: "array", items: { type: "string" } },
    certifications: { type: "array", items: { type: "object" } },
    achievements: { type: "array", items: { type: "string" } },
    awards: { type: "array", items: { type: "string" } },
    hackathons: { type: "array", items: { type: "string" } },
    volunteerExperience: { type: "array", items: { type: "string" } },
    publications: { type: "array", items: { type: "string" } },
    courses: { type: "array", items: { type: "object" } },
  },
  required: ["personalInfo", "skills"],
};

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: APP_NAME,
    version: APP_VERSION,
    description: APP_DESCRIPTION,
    contact: { name: "Resume Generator Team" },
  },
  servers: [
    { url: "http://localhost:5000", description: "Local dev" },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Extraction" },
    { name: "AI" },
    { name: "Projects" },
    { name: "Templates" },
  ],
  components: {
    schemas: {
      Project: projectSchema,
      Resume: resumeSchema,
      ProjectEnvelope: okEnvelope("Project"),
      ProjectListEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              projects: { type: "array", items: { $ref: "#/components/schemas/Project" } },
            },
          },
        },
      },
      ResumeEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              source: { type: "string", enum: ["text", "file"] },
              extractedLength: { type: "integer" },
              fileName: { type: "string" },
              mimeType: { type: "string" },
              sizeBytes: { type: "integer" },
              resume: { $ref: "#/components/schemas/Resume" },
            },
          },
        },
      },
      HealthReport: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              status: { type: "string", enum: ["ok", "degraded"] },
              uptimeSeconds: { type: "integer" },
              timestamp: { type: "string" },
              version: { type: "string" },
              checks: { type: "object" },
            },
          },
        },
      },
      Error: errorResponse,
    },
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check (cached)",
        responses: {
          200: { description: "ok", content: { "application/json": { schema: { $ref: "#/components/schemas/HealthReport" } } } },
        },
      },
    },
    "/health/live": { get: { tags: ["Health"], summary: "Liveness probe", responses: { 200: { description: "ok" } } } },
    "/health/ready": { get: { tags: ["Health"], summary: "Readiness probe", responses: { 200: { description: "ok" } } } },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "ok" },
          401: { description: "unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/extract-resume": {
      post: {
        tags: ["Extraction"],
        summary: "Extract resume from JSON text or a file upload (compat endpoint)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { text: { type: "string", minLength: 1 } },
                required: ["text"],
              },
            },
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  resume: { type: "string", format: "binary" },
                },
                required: ["resume"],
              },
            },
          },
        },
        responses: {
          200: { description: "ok", content: { "application/json": { schema: { $ref: "#/components/schemas/ResumeEnvelope" } } } },
          400: { description: "bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          413: { description: "file too large", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          415: { description: "unsupported file", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          422: { description: "no text extractable", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/extract/text": {
      post: {
        tags: ["Extraction"],
        summary: "Extract resume from plain text",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["text"],
                properties: { text: { type: "string", minLength: 1, maxLength: 50000 } },
              },
            },
          },
        },
        responses: { 200: { description: "ok" }, 400: { description: "validation error" } },
      },
    },
    "/api/extract/file": {
      post: {
        tags: ["Extraction"],
        summary: "Extract resume from an uploaded PDF or DOCX",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: { resume: { type: "string", format: "binary" } },
                required: ["resume"],
              },
            },
          },
        },
        responses: { 200: { description: "ok" }, 415: { description: "unsupported file" } },
      },
    },
    "/api/projects": {
      post: {
        tags: ["Projects"],
        summary: "Create a new resume project",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 201: { description: "created" } },
      },
    },
    "/api/projects/list": {
      get: {
        tags: ["Projects"],
        summary: "List the current user's projects",
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { tags: ["Projects"], summary: "Get a project by id", responses: { 200: { description: "ok" } } },
      delete: { tags: ["Projects"], summary: "Delete a project", responses: { 204: { description: "deleted" } } },
    },
    "/api/projects/{id}/target-role": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Set the target role for a project",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["role"], properties: { role: { type: "string" } } } } },
        },
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/job-description": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Set the job description for a project",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["jobDescription"], properties: { jobDescription: { type: "string" } } } } },
        },
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/resume": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Attach a resume (structured or rawText) to the project",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/role-analysis": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Run role analysis",
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/skill-gap": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Run skill-gap analysis",
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/blueprint": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Build a resume blueprint",
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/generate": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Generate the final resume",
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/quality-check": {
      get: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Get the latest quality-check result",
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/projects/{id}/preview": {
      get: {
        tags: ["Projects"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "template", in: "query", required: false, schema: { type: "string" } },
        ],
        summary: "Render an HTML preview of the generated resume",
        responses: { 200: { description: "html" } },
      },
    },
    "/api/projects/{id}/export/pdf": {
      post: {
        tags: ["Projects"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        summary: "Export the generated resume as a PDF",
        responses: {
          200: {
            description: "pdf",
            content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
          },
        },
      },
    },
    "/api/ai/role-analysis": {
      post: {
        tags: ["AI"],
        summary: "Run a one-shot role analysis",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: { 200: { description: "ok" } },
      },
    },
    "/api/ai/skill-gap": {
      post: { tags: ["AI"], summary: "Run a one-shot skill-gap analysis", responses: { 200: { description: "ok" } } },
    },
    "/api/ai/blueprint": {
      post: { tags: ["AI"], summary: "Build a one-shot blueprint", responses: { 200: { description: "ok" } } },
    },
    "/api/ai/generate": {
      post: { tags: ["AI"], summary: "One-shot generation", responses: { 200: { description: "ok" } } },
    },
    "/api/ai/quality-check": {
      post: { tags: ["AI"], summary: "One-shot quality check", responses: { 200: { description: "ok" } } },
    },
    "/api/ai/templates": {
      get: { tags: ["Templates"], summary: "List available templates", responses: { 200: { description: "ok" } } },
    },
  },
};

export default openapiSpec;
