import { useContext, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import DownloadResumeDialog from "../components/dashboard/DownloadResumeDialog";
import DeleteConfirmDialog from "../components/dashboard/DeleteConfirmDialog";
import { useToast } from "../components/ui/ToastContext";
import { createResume, deleteResume, updateResume } from "../services/resumeService";
import { templates } from "../data/templates";
import "../styles/ResumePreview.css";

export default function ResumePreview() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { success, error: toastError, requireAuth } = useToast();
    const [searchParams] = useSearchParams();
    const savedResume = location.state?.savedResume;
    const resumeData = savedResume?.resumeData || location.state?.resumeData;
    const templateId = searchParams.get("template") || savedResume?.templateId || location.state?.templateId || "modern";
    const selectedTemplate = templates.find((template) => template.id === templateId) || templates[0];
    const TemplateComponent = selectedTemplate.component;
    const [showDownload, setShowDownload] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [busy, setBusy] = useState(false);
    const [resumeId, setResumeId] = useState(savedResume?.resumeId || null);

    const resume = {
        ...(savedResume || {
            title: location.state?.title || "Untitled Resume",
            templateId,
            resumeData,
            targetRole: location.state?.targetRole || "",
            jobDescription: location.state?.jobDescription || "",
            prompt: location.state?.prompt || "",
            atsAnalysis: location.state?.atsAnalysis,
        }),
        resumeId: resumeId || savedResume?.resumeId,
    };

    if (!resumeData) {
        return (
            <main className="resume-preview-page">
                <section className="resume-preview-empty">
                    <h1>Resume preview unavailable</h1>
                    <p>Open a saved resume from My Resumes to preview it.</p>
                    <button type="button" onClick={() => navigate("/my-resumes")}>Back to My Resumes</button>
                </section>
            </main>
        );
    }

    const handleEdit = () => {
        navigate(`/editor?template=${resume.templateId || "modern"}`, { state: { savedResume: resume } });
    };

    const handleDownload = (format) => {
        navigate(`/editor?template=${resume.templateId || "modern"}`, {
            state: { savedResume: resume, downloadFormat: format },
        });
    };

    const handleSave = async () => {
        if (!user) {
            requireAuth("Sign in to save your resume");
            return;
        }

        setBusy(true);

        try {
            const { resumeId: currentResumeId, ...resumeToSave } = resume;
            if (currentResumeId) {
                await updateResume(user.uid, currentResumeId, resumeToSave);
            } else {
                const newResumeId = await createResume(user.uid, resumeToSave);
                setResumeId(newResumeId);
            }
            success("Resume saved successfully!");
            navigate("/my-resumes", { state: { savedResume: { ...resume, resumeId: resumeId || currentResumeId } } });
        } catch (error) {
            console.error("Failed to save resume:", error);
            toastError("Failed to save resume. Please try again.");
        } finally {
            setBusy(false);
        }
    };



    const handleDelete = async () => {
        setBusy(true);
        try {
            await deleteResume(user.uid, resume.resumeId);
            navigate("/my-resumes");
        } catch (error) {
            console.error("Failed to delete resume:", error);
            setBusy(false);
            setShowDelete(false);
        }
    };

    return (
        <main className="resume-preview-page">
            <header className="resume-preview-header">
                <div className="resume-preview-title-group">
                    <button type="button" className="resume-preview-back" onClick={() => navigate("/my-resumes")} title="Back to My Resumes">
                        ←
                    </button>
                    <div>
                        <h1>{resume.title || "Untitled Resume"}</h1>
                        <p>{selectedTemplate.name} template preview</p>
                    </div>
                </div>
                <div className="resume-preview-action-area">
                    <div className="resume-preview-actions" aria-label="Resume actions">
                        <button type="button" className="resume-preview-edit" onClick={handleEdit} disabled={busy}>Edit</button>
                        <button type="button" onClick={() => setShowDownload(true)} disabled={busy}>Download</button>
                        <button type="button" className="resume-preview-save" onClick={handleSave} disabled={busy}>
                            {busy ? "Saving..." : "Save"}
                        </button>
                        {resume.resumeId && (
                            <button type="button" className="resume-preview-delete" onClick={() => setShowDelete(true)} disabled={busy}>Delete</button>
                        )}
                    </div>
                </div>
            </header>

            <section className="resume-preview-canvas" aria-label="Resume preview">
                <TemplateComponent resumeData={resume.resumeData} />
            </section>

            {showDownload && (
                <DownloadResumeDialog
                    resume={resume}
                    onDownload={handleDownload}
                    onClose={() => setShowDownload(false)}
                />
            )}

            {showDelete && (
                <DeleteConfirmDialog
                    resumeTitle={resume.title}
                    onConfirm={handleDelete}
                    onClose={() => setShowDelete(false)}
                />
            )}
        </main>
    );
}