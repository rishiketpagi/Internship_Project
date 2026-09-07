/**
 * Reusable Joi schema fragments.
 */
import Joi from "joi";

export const objectIdPattern = /^[A-Za-z0-9_-]{1,64}$/;

export const idSchema = Joi.string().pattern(objectIdPattern).required();

export const nonEmptyString = Joi.string().trim().min(1).max(10_000);
export const mediumString = Joi.string().trim().min(1).max(2_000);
export const longString = Joi.string().trim().min(1).max(50_000);

export const paginationQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
});

export const personalInfoSchema = Joi.object({
  name: Joi.string().allow("").max(200),
  email: Joi.string().email({ tlds: { allow: false } }).allow("").max(200),
  phone: Joi.string().allow("").max(40),
  location: Joi.string().allow("").max(200),
  linkedin: Joi.string().allow("").max(300),
  github: Joi.string().allow("").max(300),
  portfolio: Joi.string().allow("").max(500),
}).default();

export const educationItem = Joi.object({
  institution: Joi.string().allow("").max(200),
  degree: Joi.string().allow("").max(200),
  field: Joi.string().allow("").max(200),
  startDate: Joi.string().allow("").max(40),
  endDate: Joi.string().allow("").max(40),
  grade: Joi.string().allow("").max(40),
});

export const experienceItem = Joi.object({
  jobTitle: Joi.string().allow("").max(200),
  company: Joi.string().allow("").max(200),
  location: Joi.string().allow("").max(200),
  startDate: Joi.string().allow("").max(40),
  endDate: Joi.string().allow("").max(40),
  description: Joi.string().allow("").max(2000),
  responsibilities: Joi.array().items(Joi.string().max(500)).max(50),
});

export const projectItem = Joi.object({
  name: Joi.string().allow("").max(200),
  description: Joi.string().allow("").max(2000),
  technologies: Joi.array().items(Joi.string().max(80)).max(50),
  url: Joi.string().uri().allow("").max(500),
  startDate: Joi.string().allow("").max(40),
  endDate: Joi.string().allow("").max(40),
});

export const certificationItem = Joi.object({
  name: Joi.string().allow("").max(200),
  issuer: Joi.string().allow("").max(200),
  date: Joi.string().allow("").max(40),
});

export const courseItem = Joi.object({
  name: Joi.string().allow("").max(200),
  provider: Joi.string().allow("").max(200),
  date: Joi.string().allow("").max(40),
});

export const resumeSchema = Joi.object({
  personalInfo: personalInfoSchema,
  professionalSummary: Joi.string().allow("").max(2000),
  education: Joi.array().items(educationItem).max(50),
  workExperience: Joi.array().items(experienceItem).max(50),
  internships: Joi.array().items(experienceItem).max(50),
  projects: Joi.array().items(projectItem).max(50),
  skills: Joi.array().items(Joi.string().max(80)).max(200),
  certifications: Joi.array().items(certificationItem).max(50),
  achievements: Joi.array().items(Joi.string().max(500)).max(50),
  awards: Joi.array().items(Joi.string().max(500)).max(50),
  hackathons: Joi.array().items(Joi.string().max(500)).max(50),
  volunteerExperience: Joi.array().items(Joi.string().max(500)).max(50),
  publications: Joi.array().items(Joi.string().max(500)).max(50),
  courses: Joi.array().items(courseItem).max(50),
});
