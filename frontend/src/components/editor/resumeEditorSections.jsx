import EducationEditor from "./EducationEditor";
import ExperienceEditor from "./ExperienceEditor";
import ProjectsEditor from "./ProjectsEditor";
import SkillsEditor from "./SkillsEditor";
import CertificationsEditor from "./CertificationsEditor";
import AchievementsEditor from "./AchievementsEditor";

export function createMovableResumeSections(resumeData, updateSection) {
    return {
        education: {
            title: "Education",
            content: <EducationEditor value={resumeData.education} onChange={(value) => updateSection("education", value)} />,
        },
        experience: {
            title: "Work Experience",
            content: <ExperienceEditor value={resumeData.workExperience} onChange={(value) => updateSection("workExperience", value)} />,
        },
        projects: {
            title: "Projects",
            content: <ProjectsEditor value={resumeData.projects} onChange={(value) => updateSection("projects", value)} />,
        },
        skills: {
            title: "Skills",
            content: <SkillsEditor value={resumeData.skills} onChange={(value) => updateSection("skills", value)} />,
        },
        certifications: {
            title: "Certifications",
            content: <CertificationsEditor value={resumeData.certifications} onChange={(value) => updateSection("certifications", value)} />,
        },
        achievements: {
            title: "Achievements",
            content: <AchievementsEditor value={resumeData.achievements} onChange={(value) => updateSection("achievements", value)} />,
        },
    };
}
