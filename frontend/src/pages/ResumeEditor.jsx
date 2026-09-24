import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { AuthContext } from "../components/auth/AuthContext";
import EditorSection from "../components/editor/EditorSection";
import ResumeEditorHeader from "../components/editor/ResumeEditorHeader";
import ResumePreviewPanel from "../components/editor/ResumePreviewPanel";
import PersonalInfoEditor from "../components/editor/PersonalInfoEditor";
import SummaryEditor from "../components/editor/SummaryEditor";
import { createMovableResumeSections } from "../components/editor/resumeEditorSections";
import { sampleResumeData } from "../data/sampleResumeData";
import { createResume, updateResume } from "../services/resumeService";
import { templates } from "../data/templates";
import { useToast } from "../components/ui/ToastContext";
import "../styles/ResumeEditor.css";

/** Turn a candidate name into a safe filename prefix */
function safeFilename(name) {
    if (!name) return "Resume";
    return name.trim().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
}

export default function ResumeEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTemplateId = searchParams.get("template");
    const templateIndex = Math.max(0, templates.findIndex((template) => template.id === requestedTemplateId));
    const templateId = templates[templateIndex]?.id || templates[0].id;
    const selectedTemplate = templates[templateIndex] || templates[0];
    const TemplateComponent = selectedTemplate.component;
    const roleResumeData = location.state?.roleResumeData;
    const savedResume = location.state?.savedResume;
    const { user } = useContext(AuthContext);
    const { success, error: toastError, requireAuth } = useToast();

    const [resumeData, setResumeData] = useState(
        savedResume?.resumeData
        || roleResumeData?.candidateProfile
        || location.state?.resumeData
        || sampleResumeData
    );

    const [resumeId, setResumeId] = useState(savedResume?.resumeId || location.state?.resumeId || null);
    const [resumeTitle, setResumeTitle] = useState(savedResume?.title || "");
    const [targetRole] = useState(
        savedResume?.targetRole || location.state?.targetRole || roleResumeData?.targetRole || ""
    );

    const [previewScale, setPreviewScale] = useState(0.55);
    const [openSections, setOpenSections] = useState({
        personalInfo: true,
        summary: true,
    });
    const DEFAULT_SECTION_ORDER = [
        "education",
        "experience",
        "projects",
        "skills",
        "certifications",
        "achievements",
    ];
    const [sectionOrder, setSectionOrder] = useState(
        resumeData?.sectionOrder || DEFAULT_SECTION_ORDER
    );
    const [draggedSection, setDraggedSection] = useState(null);

    // ATS — only store score and job description for the chip + navigation
    const [atsAnalysis] = useState(location.state?.atsAnalysis || null);
    const [jobDescription] = useState(savedResume?.jobDescription || location.state?.jobDescription || "");
    const [prompt] = useState(location.state?.prompt || savedResume?.prompt || "");

    // Download / save states
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
            updateSection("sectionOrder", nextOrder);
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
            updateSection("sectionOrder", nextOrder);
            return nextOrder;
        });
        setDraggedSection(null);
    };

    const movableSections = createMovableResumeSections(resumeData, updateSection);

    const handleSave = async () => {
        const candidateName = resumeData.personalInfo?.name?.trim() || "Resume";
        const title = resumeTitle || `${candidateName} - ${targetRole || "Resume"}`;
        const resume = {
            title,
            resumeData,
            templateId,
            targetRole,
            jobDescription,
            prompt,
            atsAnalysis,
        };

        if (!user) {
            sessionStorage.setItem("pendingResumeSave", JSON.stringify(resume));
            navigate("/signup", { state: { message: "Create an account to save your resume!" } });
            return;
        }

        setIsSaving(true);

        try {
            if (resumeId) {
                await updateResume(user.uid, resumeId, resume);
            } else {
                const newResumeId = await createResume(user.uid, resume);
                setResumeId(newResumeId);
                setResumeTitle(title);
            }
            success("Resume saved successfully!");
        } catch (saveError) {
            console.error("Resume save error:", saveError);
            toastError("Unable to save your resume. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleGoToATS = () => {
        navigate("/ats-analysis", {
            state: {
                resumeData,
                targetRole,
                jobDescription,
                prompt,
                atsAnalysis,
                templateId,
                resumeId,
            },
        });
    };

    const handleBack = () => {
        navigate("/my-resumes", {
            state: {
                roleResumeData,
                resumeData,
                targetRole,
                atsAnalysis,
                jobDescription,
                prompt,
            },
        });
    };



    // ── PDF Download ─────────────────────────────────────────────
    const handleDownloadPdf = async () => {
        if (!resumeRef.current) return;
        setIsDownloadingPdf(true);


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
            success("PDF downloaded successfully!");
        } catch (err) {
            console.error("PDF generation error:", err);
            toastError("Unable to generate the PDF. Please try again.");
        } finally {
            // Restore zoom
            el.style.zoom = previousZoom;
            setIsDownloadingPdf(false);
        }
    };

    // ── DOCX Download ────────────────────────────────────────────
    const handleDownloadDocx = async () => {
        setIsDownloadingDocx(true);

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
            success("DOCX downloaded successfully!");
        } catch (err) {
            console.error("DOCX generation error:", err);
            toastError("Unable to generate the DOCX. Please try again.");
        } finally {
            setIsDownloadingDocx(false);
        }
    };

    useEffect(() => {
        const downloadFormat = location.state?.downloadFormat;
        if (!downloadFormat || !resumeRef.current) return;

        const download = downloadFormat === "pdf" ? handleDownloadPdf : handleDownloadDocx;
        const timer = window.setTimeout(download, 0);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.downloadFormat, resumeData]);

    return (
        <main className="resume-editor-page">
            {/* ── Full-width top bar ── */}
            <ResumeEditorHeader
                resumeTitle={resumeTitle}
                onResumeTitleChange={setResumeTitle}
                targetRole={targetRole}
                isSaving={isSaving}
                isDownloadingPdf={isDownloadingPdf}
                isDownloadingDocx={isDownloadingDocx}
                onSave={handleSave}
                onDownloadPdf={handleDownloadPdf}
                onDownloadDocx={handleDownloadDocx}
                atsAnalysis={atsAnalysis}
                onCheckATS={handleGoToATS}
                onBack={handleBack}
            />

            <div className="resume-editor-layout">

                {/* ── Left: Editor panel ── */}
                <section className="resume-editor-form-panel">
                    <div className="resume-editor-sections-scroll">
                        <div className="resume-editor-sections-label">
                            <p className="resume-editor-sections-eyebrow">Edit Sections</p>
                            <p className="resume-editor-sections-hint">Open a section to edit. Drag to rearrange.</p>
                        </div>

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

                        <EditorSection
                            title="Professional Summary"
                            sectionKey="summary"
                            isOpen={openSections.summary}
                            onToggle={toggleSection}
                        >
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
                    </div>
                </section>

                {/* ── Right: Preview panel ── */}
                <ResumePreviewPanel
                    selectedTemplate={selectedTemplate}
                    TemplateComponent={TemplateComponent}
                    roleResumeData={roleResumeData}
                    resumeData={resumeData}
                    resumeRef={resumeRef}
                    previewScale={previewScale}
                    onPreviewWheel={handlePreviewWheel}
                    onChangeTemplate={changeTemplate}
                    onZoomChange={(amount) => setPreviewScale((scale) => Math.min(1.2, Math.max(0.35, scale + amount)))}
                    onResetZoom={() => setPreviewScale(0.55)}
                />
            </div>
        </main>
    );
}
