import { useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ModernTemplate from "../components/templates/ModernTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import PersonalInfoEditor from "../components/editor/PersonalInfoEditor";
import SummaryEditor from "../components/editor/SummaryEditor";
import EducationEditor from "../components/editor/EducationEditor";
import ExperienceEditor from "../components/editor/ExperienceEditor";
import ProjectsEditor from "../components/editor/ProjectsEditor";
import SkillsEditor from "../components/editor/SkillsEditor";
import CertificationsEditor from "../components/editor/CertificationsEditor";
import AchievementsEditor from "../components/editor/AchievementsEditor";
import { sampleResumeData } from "../data/sampleResumeData";
import "../styles/ResumeEditor.css";

const templateComponents = {
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    minimal: MinimalTemplate,
};

export default function ResumeEditor() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get("template") || "modern";
    const TemplateComponent = templateComponents[templateId] || ModernTemplate;
    const [resumeData, setResumeData] = useState(
        location.state?.resumeData || sampleResumeData
    );
    const [previewScale, setPreviewScale] = useState(0.55);

    const updateSection = (sectionName, value) => {
        setResumeData((currentResume) => ({
            ...currentResume,
            [sectionName]: value,
        }));
    };

    const handlePreviewWheel = (event) => {
        if (!event.ctrlKey) {
            return;
        }

        event.preventDefault();
        setPreviewScale((currentScale) =>
            Math.min(
                1.2,
                Math.max(0.35, currentScale + (event.deltaY < 0 ? 0.05 : -0.05))
            )
        );
    };

    return (
        <main className="resume-editor-page">
            <header className="resume-editor-header">
                <h1 className="resume-editor-title">Resume Editor</h1>

                <div className="resume-editor-actions">
                    <button className="resume-editor-save-button">Save</button>
                    <button className="resume-editor-download-button">Download PDF</button>
                </div>
            </header>

            <div className="resume-editor-layout">
                <section className="resume-editor-form-panel">
                    <h2 className="resume-editor-heading">Edit Resume</h2>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Personal Information</h3>
                        <PersonalInfoEditor
                            value={resumeData.personalInfo}
                            onChange={(value) => updateSection("personalInfo", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Professional Summary</h3>
                        <SummaryEditor
                            value={resumeData.professionalSummary}
                            onChange={(value) => updateSection("professionalSummary", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Education</h3>
                        <EducationEditor
                            value={resumeData.education}
                            onChange={(value) => updateSection("education", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Work Experience</h3>
                        <ExperienceEditor
                            value={resumeData.workExperience}
                            onChange={(value) => updateSection("workExperience", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Projects</h3>
                        <ProjectsEditor
                            value={resumeData.projects}
                            onChange={(value) => updateSection("projects", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Skills</h3>
                        <SkillsEditor
                            value={resumeData.skills}
                            onChange={(value) => updateSection("skills", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Certifications</h3>
                        <CertificationsEditor
                            value={resumeData.certifications}
                            onChange={(value) => updateSection("certifications", value)}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">Achievements</h3>
                        <AchievementsEditor
                            value={resumeData.achievements}
                            onChange={(value) => updateSection("achievements", value)}
                        />
                    </div>
                </section>

                <section className="resume-editor-preview-panel" onWheel={handlePreviewWheel}>
                    <div className="resume-editor-preview-toolbar">
                        <button
                            type="button"
                            onClick={() => setPreviewScale((currentScale) => Math.max(0.35, currentScale - 0.05))}
                            className="resume-editor-zoom-button"
                            aria-label="Zoom out preview"
                        >
                            -
                        </button>
                        <span>{Math.round(previewScale * 100)}%</span>
                        <button
                            type="button"
                            onClick={() => setPreviewScale((currentScale) => Math.min(1.2, currentScale + 0.05))}
                            className="resume-editor-zoom-button"
                            aria-label="Zoom in preview"
                        >
                            +
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewScale(0.55)}
                            className="resume-editor-zoom-reset"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="resume-editor-preview" style={{ "--preview-scale": previewScale }}>
                        <TemplateComponent resumeData={resumeData} />
                    </div>
                </section>
            </div>
        </main>
    );
}

