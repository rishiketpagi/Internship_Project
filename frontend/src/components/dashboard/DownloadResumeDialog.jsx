export default function DownloadResumeDialog({ resume, onDownload, onClose }) {
    return (
        <div className="my-resumes-dialog-backdrop" role="presentation" onClick={onClose}>
            <section
                className="my-resumes-download-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="download-resume-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="download-resume-title">Download resume</h2>
                <p>Choose a file format for {resume.title || "this resume"}.</p>
                <div className="my-resumes-dialog-actions">
                    <button type="button" onClick={() => onDownload("pdf")}>PDF</button>
                    <button type="button" onClick={() => onDownload("docx")}>DOCX</button>
                    <button type="button" onClick={onClose} className="my-resumes-dialog-cancel">
                        Cancel
                    </button>
                </div>
            </section>
        </div>
    );
}
