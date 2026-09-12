function formatUpdatedAt(timestamp) {
    if (!timestamp?.toDate) return "Not saved yet";

    return timestamp.toDate().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function ResumeCard({
    resume,
    isEditing,
    editingTitle,
    onEditingTitleChange,
    onSaveTitle,
    onStartRename,
    onEdit,
    onDownload,
    onDuplicate,
    onDelete,
}) {
    return (
        <article className="my-resume-card">
            {isEditing ? (
                <div className="my-resume-title-editor">
                    <input
                        value={editingTitle}
                        onChange={(event) => onEditingTitleChange(event.target.value)}
                        aria-label="Resume title"
                        autoFocus
                    />
                    <button type="button" onClick={onSaveTitle}>
                        Save Title
                    </button>
                </div>
            ) : (
                <div className="my-resume-title-row">
                    <h2>{resume.title || "Untitled Resume"}</h2>
                    <button type="button" onClick={onStartRename} aria-label="Rename resume">
                        Edit Title
                    </button>
                </div>
            )}
            <p>Template: <strong>{resume.templateId || "modern"}</strong></p>
            <p>Updated: {formatUpdatedAt(resume.updatedAt)}</p>
            <div className="my-resume-actions">
                <button type="button" onClick={onEdit}>Edit</button>
                <button type="button" onClick={onDownload}>Download</button>
                <button type="button" onClick={onDuplicate}>Duplicate</button>
                <button type="button" onClick={onDelete} className="my-resume-delete-button">
                    Delete
                </button>
            </div>
        </article>
    );
}
