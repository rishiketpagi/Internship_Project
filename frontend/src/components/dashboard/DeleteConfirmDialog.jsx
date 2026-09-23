const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
);

export default function DeleteConfirmDialog({ resumeTitle, onConfirm, onClose }) {
    return (
        <div className="my-resumes-dialog-backdrop" role="presentation" onClick={onClose}>
            <section
                className="my-resumes-download-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-resume-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="delete-dialog-icon" aria-hidden="true">
                    <TrashIcon />
                </div>
                <h2 id="delete-resume-title">Delete resume?</h2>
                <p>
                    <strong>{resumeTitle || "This resume"}</strong> will be permanently deleted.
                    This action cannot be undone.
                </p>
                <div className="my-resumes-dialog-actions">
                    <button
                        type="button"
                        className="delete-dialog-confirm-btn"
                        onClick={onConfirm}
                        id="delete-confirm-btn"
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="my-resumes-dialog-cancel"
                        id="delete-cancel-btn"
                    >
                        Cancel
                    </button>
                </div>
            </section>
        </div>
    );
}
