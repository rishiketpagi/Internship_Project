/* eslint-disable react-refresh/only-export-components */
import PersonalInfoEditor from "../editor/PersonalInfoEditor";
import SummaryEditor from "../editor/SummaryEditor";
import EducationEditor from "../editor/EducationEditor";
import ExperienceEditor from "../editor/ExperienceEditor";
import ProjectsEditor from "../editor/ProjectsEditor";
import SkillsEditor from "../editor/SkillsEditor";
import CertificationsEditor from "../editor/CertificationsEditor";
import AchievementsEditor from "../editor/AchievementsEditor";

const ICON_PROPS = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

function Icon({ children }) {
    return <svg {...ICON_PROPS}>{children}</svg>;
}

export const PROFILE_SECTIONS = [
    {
        key: "personalInfo",
        label: "Personal Information",
        icon: <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>,
        Editor: PersonalInfoEditor,
    },
    {
        key: "professionalSummary",
        label: "Professional Summary",
        icon: <Icon><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></Icon>,
        Editor: SummaryEditor,
    },
    {
        key: "education",
        label: "Education",
        icon: <Icon><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></Icon>,
        Editor: EducationEditor,
    },
    {
        key: "workExperience",
        label: "Work Experience",
        icon: <Icon><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon>,
        Editor: ExperienceEditor,
    },
    {
        key: "projects",
        label: "Projects",
        icon: <Icon><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></Icon>,
        Editor: ProjectsEditor,
    },
    {
        key: "skills",
        label: "Skills",
        icon: <Icon><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" /></Icon>,
        Editor: SkillsEditor,
    },
    {
        key: "certifications",
        label: "Certifications",
        icon: <Icon><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></Icon>,
        Editor: CertificationsEditor,
    },
    {
        key: "achievements",
        label: "Achievements",
        icon: <Icon><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55-.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></Icon>,
        Editor: AchievementsEditor,
    },
];
