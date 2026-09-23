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

function relativeDate(timestamp) {
    if (!timestamp?.toDate) return "Not saved yet";

    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/* ---- SVG icon set ---- */
const Icons = {
    edit: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    download: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    ),
    duplicate: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    ),
    trash: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    ),
    pencil: (
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
    ),
    clock: (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    check: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
};

export default function ResumeCard({
    resume,
    isEditing,
    editingTitle,
    onEditingTitleChange,
    onSaveTitle,
    onStartRename,
    onPreview,
    onEdit,
    onDownload,
    onDuplicate,
    onDelete,
}) {
    const accent = getAccent(resume.templateId);

    return (
        <article
            className="my-resume-card"
            style={{ "--card-accent": accent.color }}
            onClick={(event) => {
                if (!event.target.closest("button, input")) onPreview();
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter" && event.target === event.currentTarget) onPreview();
            }}
            tabIndex={0}
        >
            {/* Accent bar */}
            <div className="my-resume-accent-bar" aria-hidden="true" />

            {/* Title row */}
            {isEditing ? (
                <div className="my-resume-title-editor">
                    <input
                        value={editingTitle}
                        onChange={(e) => onEditingTitleChange(e.target.value)}
                        aria-label="Resume title"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && onSaveTitle()}
                    />
                    <button type="button" className="my-resume-save-title-btn" onClick={onSaveTitle} aria-label="Save title">
                        {Icons.check}
                    </button>
                </div>
            ) : (
                <div className="my-resume-title-row">
                    <button type="button" className="my-resume-title-button" onClick={onPreview}>
                        <h2 title={resume.title || "Untitled Resume"}>
                            {resume.title || "Untitled Resume"}
                        </h2>
                    </button>
                    <button
                        type="button"
                        className="my-resume-icon-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onStartRename();
                        }}
                        aria-label="Rename resume"
                        title="Rename"
                    >
                        {Icons.pencil}
                    </button>
                </div>
            )}

            {/* Meta */}
            <div className="my-resume-meta">
                <span
                    className="my-resume-template-badge"
                    style={{ background: accent.color + "18", color: accent.color }}
                >
                    {accent.label}
                </span>
                <span className="my-resume-date" title={resume.updatedAt?.toDate?.().toLocaleString?.()}>
                    {Icons.clock}
                    {relativeDate(resume.updatedAt)}
                </span>
            </div>

            {/* Actions */}
            <div className="my-resume-actions">
                <button
                    type="button"
                    className="my-resume-action-btn my-resume-action-primary"
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit();
                    }}
                    id={`edit-resume-${resume.resumeId}`}
                >
                    {Icons.edit} Edit
                </button>
                <button
                    type="button"
                    className="my-resume-action-btn my-resume-action-secondary"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDownload();
                    }}
                    id={`download-resume-${resume.resumeId}`}
                >
                    {Icons.download} Download
                </button>
                <button
                    type="button"
                    className="my-resume-action-btn my-resume-action-ghost"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDuplicate();
                    }}
                    id={`duplicate-resume-${resume.resumeId}`}
                >
                    {Icons.duplicate} Duplicate
                </button>
                <button
                    type="button"
                    className="my-resume-action-btn my-resume-action-danger"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    id={`delete-resume-${resume.resumeId}`}
                >
                    {Icons.trash} Delete
                </button>
            </div>
        </article>
    );
}
