// Single source of truth for the role list shown in the
// Create Resume dropdown. Keep this file (not roles.json) so
// that `import { roles } from "../data/roles"` works the way
// CreateResume.jsx expects.
//
// Roles here MUST match the keys in backend/src/data/roles.json
// so that targetRole values are valid for the AI pipeline.
export const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "UI/UX Designer",
];

// Required skills per role, used by the role-analysis prompt
// to decide which resume items to surface for each target role.
export const rolesSkills = {
    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "TypeScript",
        "Git",
    ],
    "Backend Developer": [
        "Node.js",
        "Express.js",
        "REST APIs",
        "Databases",
        "Authentication",
        "Git",
    ],
    "Full Stack Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "Express.js",
        "REST APIs",
        "Databases",
        "Git",
    ],
    "Data Analyst": [
        "Excel",
        "SQL",
        "Python",
        "Statistics",
        "Data Visualization",
        "Power BI",
    ],
    "UI/UX Designer": [
        "Figma",
        "Wireframing",
        "Prototyping",
        "User Research",
        "UI Design",
        "UX Design",
    ],
};
