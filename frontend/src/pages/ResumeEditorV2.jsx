/*
 * ResumeEditorV2 — the v2 page using DocumentWorkspace.
 * Side-by-side with /editor (the existing 2-column editor) during transition.
 * Uses the same data model + same template components, just a different shell.
 */
import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { AuthContext } from "../components/auth/AuthContext";
import { apiUrl } from "../config/api";
import { DocumentWorkspace } from "../components/editor-v2";
import PersonalInfoEditor from "../components/editor/PersonalInfoEditor";
import SummaryEditor from "../components/editor/SummaryEditor";
import EducationEditor from "../components/editor/EducationEditor";
import ExperienceEditor from "../components/editor/ExperienceEditor";
import ProjectsEditor from "../components/editor/ProjectsEditor";
import SkillsEditor from "../components/editor/SkillsEditor";
import CertificationsEditor from "../components/editor/CertificationsEditor";
import AchievementsEditor from "../components/editor/AchievementsEditor";
import { sampleResumeData } from "../data/sampleResumeData";
import { createResume, updateResume } from "../services/resumeService";
import { templates } from "../data/templates";
import { useToast } from "../components/ui";

function safeFilename(name) {
    if (!name) return "Resume";
    return name.trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
}

const SECTION_EDITORS = {
    personalInfo: PersonalInfoEditor,
    summary: SummaryEditor,
    experience: ExperienceEditor,
    education: EducationEditor,
    projects: ProjectsEditor,
    skills: SkillsEditor,
    certifications: CertificationsEditor,
    achievements: AchievementsEditor,
};

const SECTION_VALUE_KEYS = {
    personalInfo: "personalInfo",
    summary: "professionalSummary",
    experience: "workExperience",
    education: "education",
    projects: "projects",
    skills: "skills",
    certifications: "certifications",
    achievements: "achievements",
};

export default function ResumeEditorV2() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useContext(AuthContext);
    const toast = useToast();

    const requestedTemplateId = searchParams.get("template");
    const templateIndex = Math.max(0, templates.findIndex((t) => t.id === requestedTemplateId));
    const selectedTemplate = templates[templateIndex] || templates[0];
    const TemplateComponent = selectedTemplate.component;

    const roleResumeData = location.state?.roleResumeData;
    const savedResume = location.state?.savedResume;

    const [resumeData, setResumeData] = useState(
        savedResume?.resumeData
        || roleResumeData?.candidateProfile
        || location.state?.resumeData
        || sampleResumeData
    );
    const [resumeId, setResumeId] = useState(savedResume?.resumeId || null);
    const [targetRole] = useState(
        savedResume?.targetRole || location.state?.targetRole || roleResumeData?.targetRole || ""
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

    const previewRef = useRef(null);

    const updateSection = (sectionKey, value) => {
        const dataKey = SECTION_VALUE_KEYS[sectionKey];
        if (!dataKey) return;
        setResumeData((current) => ({ ...current, [dataKey]: value }));
    };

    const renderSectionEditor = (sectionKey) => {
        const Editor = SECTION_EDITORS[sectionKey];
        const dataKey = SECTION_VALUE_KEYS[sectionKey];
        if (!Editor || !dataKey) return null;
        const value = resumeData[dataKey];
        return (
            <Editor
                value={value}
                onChange={(value) => updateSection(sectionKey, value)}
            />
        );
    };

    const handleChangeTemplate = (id) => {
        setSearchParams({ template: id });
    };

    const handleSave = async () => {
        if (!user) {
            toast.push({
                variant: "warn",
                title: "Sign in to save",
                description: "Your edits stay in this browser until you sign in.",
                action: { label: "Sign in", onClick: () => navigate("/signin") },
            });
            return;
        }

        setIsSaving(true);
        const candidateName = resumeData.personalInfo?.name?.trim() || "Resume";
        const title = `${candidateName} - ${targetRole || "Resume"}`;
        const resume = { title, resumeData, templateId: selectedTemplate.id, targetRole };

        try {
            if (resumeId) {
                await updateResume(user.uid, resumeId, resume);
            } else {
                const newId = await createResume(user.uid, resume);
                setResumeId(newId);
            }
            toast.push({ variant: "ok", title: "Saved" });
        } catch (err) {
            console.error("Resume save error:", err);
            toast.push({ variant: "warn", title: "Couldn't save", description: "Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!previewRef.current) return;
        setIsDownloadingPdf(true);
        try {
            const filename = `${safeFilename(resumeData.personalInfo?.name)}_Resume.pdf`;
            await html2pdf()
                .set({
                    margin: 0,
                    filename,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
                })
                .from(previewRef.current)
                .save();
        } catch (err) {
            console.error("PDF error:", err);
            toast.push({ variant: "warn", title: "PDF export failed" });
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    const handleDownloadDocx = async () => {
        setIsDownloadingDocx(true);
        try {
            const response = await fetch(apiUrl("/api/resumes/generate-docx"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData }),
            });
            if (!response.ok) throw new Error(`Server responded ${response.status}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${safeFilename(resumeData.personalInfo?.name)}_Resume.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("DOCX error:", err);
            toast.push({ variant: "warn", title: "DOCX export failed" });
        } finally {
            setIsDownloadingDocx(false);
        }
    };

    return (
        <DocumentWorkspace
            TemplateComponent={TemplateComponent}
            resumeData={resumeData}
            templateName={selectedTemplate.name}
            templateId={selectedTemplate.id}
            templates={templates}
            onChangeTemplate={handleChangeTemplate}
            isSaving={isSaving}
            onSave={handleSave}
            onExportPdf={handleDownloadPdf}
            onExportDocx={handleDownloadDocx}
            onSectionUpdate={updateSection}
            renderSectionEditor={renderSectionEditor}
            targetRole={targetRole}
            onBack={() => navigate("/dashboard")}
        />
    );
}
