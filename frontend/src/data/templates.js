import ModernTemplate from "../components/templates/ModernTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import CompactTemplate from "../components/templates/CompactTemplate";
import TwoColumnTemplate from "../components/templates/TwoColumnTemplate";

/*
 * v2 plan templates — 5 functional names, preview does the talking.
 * Order: most common first.
 */
export const templates = [
    {
        id: "classic",
        name: "Classic",
        description: "Traditional single-column, recruiter-standard.",
        component: ProfessionalTemplate,
        hint: "For most roles. Recruiter-standard.",
    },
    {
        id: "modern",
        name: "Modern",
        description: "Clean single-column with a strong header rule.",
        component: ModernTemplate,
        hint: "For product / design / marketing.",
    },
    {
        id: "compact",
        name: "Compact",
        description: "Dense, smaller scale, dot-separated metadata.",
        component: CompactTemplate,
        hint: "For senior folks with long history.",
    },
    {
        id: "two-column",
        name: "Two-Column",
        description: "Left rail (name, contact, skills), right (everything else).",
        component: TwoColumnTemplate,
        hint: "For designers, PMs, hybrids.",
    },
    {
        id: "ats-plain",
        name: "ATS-Plain",
        description: "Maximum compatibility. No styling flourishes.",
        component: MinimalTemplate,
        hint: "Maximum compatibility. No styling.",
    },
];

export const templateById = Object.fromEntries(templates.map((t) => [t.id, t]));
