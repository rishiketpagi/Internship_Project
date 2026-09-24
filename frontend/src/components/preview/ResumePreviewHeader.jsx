const TEMPLATE_ACCENTS = {
    modern: { color: "#0ea5e9", label: "Modern" },
    professional: { color: "#6366f1", label: "Professional" },
    minimal: { color: "#10b981", label: "Minimal" },
    creative: { color: "#f59e0b", label: "Creative" },
    executive: { color: "#8b5cf6", label: "Executive" },
    classic: { color: "#ef4444", label: "Classic" },
};

function getAccent(templateId) {
    return TEMPLATE_ACCENTS[templateId?.toLowerCase()] ?? { color: "#0ea5e9", label: templateId || "Modern" };
}

export default function ResumePreviewHeader({
    resume,
    templateName,
    busy,
    onBack,
    onAtsScore,
    onEdit,
    onDownload,
    onSave,
    onDelete,
}) {
    const accent = getAccent(resume.templateId);
    return (
        <header className="resume-preview-header">
            <div className="resume-preview-title-group">
                <button type="button" className="resume-preview-back" onClick={onBack} title="Back to My Resumes">
                    ←
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h1>{resume.title || "Untitled Resume"}</h1>
                    <span className="resume-preview-template-badge" style={{ "--card-accent": accent.color, alignSelf: 'flex-start' }}>
                        {accent.label} Template
                    </span>
                </div>
            </div>
            <div className="resume-preview-action-area">
                <div className="resume-preview-actions" aria-label="Resume actions">
                    <button type="button" className="resume-preview-ats" onClick={onAtsScore} disabled={busy}>ATS Score</button>
                    <button type="button" className="resume-preview-edit" onClick={onEdit} disabled={busy}>Edit</button>
                    <button type="button" onClick={onDownload} disabled={busy}>Download</button>
                    <button type="button" className="resume-preview-save" onClick={onSave} disabled={busy}>
                        {busy ? "Saving..." : "Save"}
                    </button>
                    {resume.resumeId && (
                        <button type="button" className="resume-preview-delete" onClick={onDelete} disabled={busy}>Delete</button>
                    )}
                </div>
            </div>
        </header>
    );
}
