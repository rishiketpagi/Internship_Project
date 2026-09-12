export default function ResumeEditorHeader({
    isSaving,
    isDownloadingPdf,
    isDownloadingDocx,
    onSave,
    onDownloadPdf,
    onDownloadDocx,
}) {
    const isBusy = isDownloadingPdf || isDownloadingDocx;

    return (
        <header className="resume-editor-header">
            <h1 className="resume-editor-title">Resume Editor</h1>
            <div className="resume-editor-actions">
                <button
                    className="resume-editor-save-button"
                    onClick={onSave}
                    disabled={isSaving || isBusy}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                    className="resume-editor-download-button"
                    onClick={onDownloadPdf}
                    disabled={isBusy}
                    aria-label="Download resume as PDF"
                >
                    {isDownloadingPdf ? "Generating PDF…" : "Download PDF"}
                </button>
                <button
                    className="resume-editor-download-button"
                    onClick={onDownloadDocx}
                    disabled={isBusy}
                    aria-label="Download resume as DOCX"
                >
                    {isDownloadingDocx ? "Generating DOCX…" : "Download DOCX"}
                </button>
            </div>
        </header>
    );
}
