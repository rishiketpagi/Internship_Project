import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { AuthContext } from "../components/auth/AuthContext";
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
import "../styles/ResumeEditor.css";

/** Turn a candidate name into a safe filename prefix */
function safeFilename(name) {
    if (!name) return "Resume";
    return name.trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
}

function EditorSection({ title, sectionKey, isOpen, onToggle, children, isMovable, onDragStart, onDragOver, onDrop, onMove }) {
    return (
        <section
            className={`resume-editor-card${isOpen ? " is-open" : ""}`}
            draggable={isMovable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="resume-editor-card-header">
                {isMovable && (
                    <span className="resume-editor-drag-handle" aria-label={`Drag ${title} section`} title="Drag to reorder">
                        ⋮⋮
                    </span>
                )}
                <button
                    type="button"
                    className="resume-editor-card-toggle"
                    onClick={() => onToggle(sectionKey)}
                    aria-expanded={isOpen}
                >
                    <span className="resume-editor-card-title">{title}</span>
                    <span className="resume-editor-card-toggle-icon" aria-hidden="true">
                        {isOpen ? "−" : "+"}
                    </span>
                </button>
                {isMovable && (
                    <div className="resume-editor-reorder-actions">
                        <button type="button" onClick={() => onMove(sectionKey, -1)} aria-label={`Move ${title} up`} title="Move up">↑</button>
                        <button type="button" onClick={() => onMove(sectionKey, 1)} aria-label={`Move ${title} down`} title="Move down">↓</button>
                    </div>
                )}
            </div>
            {isOpen && <div className="resume-editor-card-content">{children}</div>}
        </section>
    );
}

export default function ResumeEditor() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTemplateId = searchParams.get("template");
    const templateIndex = Math.max(0, templates.findIndex((template) => template.id === requestedTemplateId));
    const templateId = templates[templateIndex]?.id || templates[0].id;
    const selectedTemplate = templates[templateIndex] || templates[0];
    const TemplateComponent = selectedTemplate.component;
    const roleResumeData = location.state?.roleResumeData;
    const savedResume = location.state?.savedResume;
    const { user } = useContext(AuthContext);

    const [resumeData, setResumeData] = useState(
        savedResume?.resumeData
        || roleResumeData?.candidateProfile
        || location.state?.resumeData
        || sampleResumeData
    );
    const [resumeId, setResumeId] = useState(savedResume?.resumeId || null);
    const [resumeTitle, setResumeTitle] = useState(savedResume?.title || "");
    const [targetRole] = useState(
        savedResume?.targetRole || location.state?.targetRole || roleResumeData?.targetRole || ""
    );
    const [previewScale, setPreviewScale] = useState(0.55);
    const [openSections, setOpenSections] = useState({
        personalInfo: true,
        summary: true,
    });
    const [sectionOrder, setSectionOrder] = useState([
        "education",
        "experience",
        "projects",
        "skills",
        "certifications",
        "achievements",
    ]);
    const [draggedSection, setDraggedSection] = useState(null);

    // Download states
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
    const [downloadError, setDownloadError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    // Ref that points to the raw resume template element (NOT the scaled wrapper)
    const resumeRef = useRef(null);

    const updateSection = (sectionName, value) => {
        setResumeData((currentResume) => ({
            ...currentResume,
            [sectionName]: value,
        }));
    };

    const handlePreviewWheel = (event) => {
        if (!event.ctrlKey) return;
        event.preventDefault();
        setPreviewScale((currentScale) =>
            Math.min(1.2, Math.max(0.35, currentScale + (event.deltaY < 0 ? 0.05 : -0.05)))
        );
    };

    const changeTemplate = (direction) => {
        const nextIndex = (templateIndex + direction + templates.length) % templates.length;
        setSearchParams({ template: templates[nextIndex].id });
    };

    const toggleSection = (sectionKey) => {
        setOpenSections((currentSections) => ({
            ...currentSections,
            [sectionKey]: !currentSections[sectionKey],
        }));
    };

    const moveSection = (sectionKey, direction) => {
        setSectionOrder((currentOrder) => {
            const currentIndex = currentOrder.indexOf(sectionKey);
            const nextIndex = currentIndex + direction;

            if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentOrder.length) {
                return currentOrder;
            }

            const nextOrder = [...currentOrder];
            [nextOrder[currentIndex], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[currentIndex]];
            return nextOrder;
        });
    };

    const handleSectionDrop = (sectionKey) => {
        if (!draggedSection || draggedSection === sectionKey) return;

        setSectionOrder((currentOrder) => {
            const fromIndex = currentOrder.indexOf(draggedSection);
            const toIndex = currentOrder.indexOf(sectionKey);
            if (fromIndex < 0 || toIndex < 0) return currentOrder;

            const nextOrder = [...currentOrder];
            nextOrder.splice(fromIndex, 1);
            nextOrder.splice(toIndex, 0, draggedSection);
            return nextOrder;
        });
        setDraggedSection(null);
    };

    const movableSections = {
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

    const handleSave = async () => {
        if (!user) {
            setSaveMessage("You need to sign in to save your resume.");
            return;
        }

        setIsSaving(true);
        setSaveMessage("");

        const candidateName = resumeData.personalInfo?.name?.trim() || "Resume";
        const title = resumeTitle || `${candidateName} - ${targetRole || "Resume"}`;
        const resume = {
            title,
            resumeData,
            templateId,
            targetRole,
        };

        try {
            if (resumeId) {
                await updateResume(user.uid, resumeId, resume);
            } else {
                const newResumeId = await createResume(user.uid, resume);
                setResumeId(newResumeId);
                setResumeTitle(title);
            }
            setSaveMessage("Saved");
        } catch (saveError) {
            console.error("Resume save error:", saveError);
            setSaveMessage("Unable to save your resume. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // ── PDF Download ─────────────────────────────────────────────
    const handleDownloadPdf = async () => {
        if (!resumeRef.current) return;
        setIsDownloadingPdf(true);
        setDownloadError("");

        // Temporarily remove the CSS zoom so html2pdf captures at full scale
        const el = resumeRef.current;
        const previousZoom = el.style.zoom;
        el.style.zoom = "1";

        try {
            const filename = `${safeFilename(resumeData.personalInfo?.name)}_Resume.pdf`;

            await html2pdf()
                .set({
                    margin: 0,
                    filename,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        onclone: (clonedDocument) => {
                            clonedDocument.querySelectorAll("style").forEach((style) => {
                                style.textContent = style.textContent.replace(
                                    /oklch\([^)]*\)/gi,
                                    "#64748b"
                                );
                            });
                        },
                    },
                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait",
                    },
                    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
                })
                .from(el)
                .save();
        } catch (err) {
            console.error("PDF generation error:", err);
            setDownloadError("Unable to generate the PDF. Please try again.");
        } finally {
            // Restore zoom
            el.style.zoom = previousZoom;
            setIsDownloadingPdf(false);
        }
    };

    // ── DOCX Download ────────────────────────────────────────────
    const handleDownloadDocx = async () => {
        setIsDownloadingDocx(true);
        setDownloadError("");

        try {
            const response = await fetch("http://localhost:5000/api/resumes/generate-docx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

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
            console.error("DOCX generation error:", err);
            setDownloadError("Unable to generate the DOCX. Please try again.");
        } finally {
            setIsDownloadingDocx(false);
        }
    };

    return (
        <main className="resume-editor-page">
            <header className="resume-editor-header">
                <h1 className="resume-editor-title">Resume Editor</h1>

                <div className="resume-editor-actions">
                    <button
                        className="resume-editor-save-button"
                        onClick={handleSave}
                        disabled={isSaving || isDownloadingPdf || isDownloadingDocx}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>

                    <button
                        className="resume-editor-download-button"
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf || isDownloadingDocx}
                        aria-label="Download resume as PDF"
                    >
                        {isDownloadingPdf ? "Generating PDF…" : "Download PDF"}
                    </button>

                    <button
                        className="resume-editor-download-button"
                        onClick={handleDownloadDocx}
                        disabled={isDownloadingPdf || isDownloadingDocx}
                        aria-label="Download resume as DOCX"
                    >
                        {isDownloadingDocx ? "Generating DOCX…" : "Download DOCX"}
                    </button>
                </div>
            </header>

            {downloadError && (
                <div className="resume-editor-download-error" role="alert">
                    {downloadError}
                </div>
            )}

            {saveMessage && (
                <div className="resume-editor-save-message" role="status">
                    {saveMessage}
                    {!user && (
                        <Link to="/signin" state={{ from: location }}>
                            Sign in
                        </Link>
                    )}
                </div>
            )}

            <div className="resume-editor-layout">
                <section className="resume-editor-form-panel">
                    <div className="resume-editor-form-intro">
                        <div>
                            <p className="resume-editor-eyebrow">Build your story</p>
                            <h2 className="resume-editor-heading">Edit Resume</h2>
                        </div>
                        <label className="resume-editor-title-field">
                            <span className="resume-editor-label">Resume title</span>
                            <input
                                type="text"
                                value={resumeTitle}
                                onChange={(event) => setResumeTitle(event.target.value)}
                                placeholder="e.g. Product Designer Resume"
                                className="resume-editor-input"
                            />
                        </label>
                    </div>

                    <p className="resume-editor-helper">Open a section to add or update details. Drag the handle or use the arrows to arrange sections.</p>

                    <EditorSection
                        title="Personal Information"
                        sectionKey="personalInfo"
                        isOpen={openSections.personalInfo}
                        onToggle={toggleSection}
                    >
                        <PersonalInfoEditor
                            value={resumeData.personalInfo}
                            onChange={(value) => updateSection("personalInfo", value)}
                        />
                    </EditorSection>

                    <EditorSection title="Professional Summary" sectionKey="summary" isOpen={openSections.summary} onToggle={toggleSection}>
                        <SummaryEditor
                            value={resumeData.professionalSummary}
                            onChange={(value) => updateSection("professionalSummary", value)}
                        />
                    </EditorSection>

                    <div className="resume-editor-reorderable-sections" aria-label="Reorderable resume sections">
                        {sectionOrder.map((sectionKey) => {
                            const section = movableSections[sectionKey];
                            return (
                                <EditorSection
                                    key={sectionKey}
                                    title={section.title}
                                    sectionKey={sectionKey}
                                    isOpen={openSections[sectionKey]}
                                    onToggle={toggleSection}
                                    isMovable
                                    onDragStart={() => setDraggedSection(sectionKey)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => handleSectionDrop(sectionKey)}
                                    onMove={moveSection}
                                >
                                    {section.content}
                                </EditorSection>
                            );
                        })}
                    </div>
                </section>

                <section className="resume-editor-preview-panel" onWheel={handlePreviewWheel}>
                    <div className="resume-editor-preview-controls">
                        <div className="resume-editor-template-switcher" aria-label="Template selection">
                            <span className="resume-editor-control-label">Template</span>
                            <button type="button" onClick={() => changeTemplate(-1)} className="resume-editor-template-button" aria-label="Previous template">&lt;</button>
                            <span className="resume-editor-template-name" aria-live="polite">{selectedTemplate.name}</span>
                            <button type="button" onClick={() => changeTemplate(1)} className="resume-editor-template-button" aria-label="Next template">&gt;</button>
                        </div>
                        <div className="resume-editor-preview-toolbar" aria-label="Preview zoom controls">
                            <span className="resume-editor-control-label">Zoom</span>
                            <button type="button" onClick={() => setPreviewScale((s) => Math.max(0.35, s - 0.05))} className="resume-editor-zoom-button" aria-label="Zoom out preview">-</button>
                            <span className="resume-editor-zoom-value">{Math.round(previewScale * 100)}%</span>
                            <button type="button" onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.05))} className="resume-editor-zoom-button" aria-label="Zoom in preview">+</button>
                            <button type="button" onClick={() => setPreviewScale(0.55)} className="resume-editor-zoom-reset">Reset</button>
                        </div>
                    </div>

                    {/* The outer div applies the CSS zoom for preview only */}
                    <div className="resume-editor-preview" style={{ "--preview-scale": previewScale }}>
                        {/* The inner div is what we ref for PDF export — zoom is managed inline */}
                        <div ref={resumeRef}>
                            <TemplateComponent
                                roleResumeData={
                                    roleResumeData
                                        ? { ...roleResumeData, candidateProfile: resumeData }
                                        : undefined
                                }
                                resumeData={resumeData}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
