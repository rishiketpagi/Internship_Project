import { useState, useRef, useEffect } from "react";

export default function ResumeEditorHeader({
    resumeTitle,
    onResumeTitleChange,
    targetRole,
    isSaving,
    isDownloadingPdf,
    isDownloadingDocx,
    onSave,
    onDownloadPdf,
    onDownloadDocx,
    atsAnalysis,
    onCheckATS,
    onBack,
    onPreview,
    saveMessage,
    downloadError,
}) {
    const [downloadOpen, setDownloadOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isBusy = isDownloadingPdf || isDownloadingDocx;

    useEffect(() => {
        if (!downloadOpen) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDownloadOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [downloadOpen]);

    const handlePdf = () => { setDownloadOpen(false); onDownloadPdf(); };
    const handleDocx = () => { setDownloadOpen(false); onDownloadDocx(); };

    const hasAtsScore = atsAnalysis?.overallScore != null;

    return (
        <header className="editor-topbar">
            {/* Left: back + title */}
            <div className="editor-topbar-left">
                <button type="button" className="editor-back-link" onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>

                <div className="editor-topbar-title-group">
                    <span className="editor-topbar-label">Edit Resume</span>
                    <input
                        type="text"
                        className="editor-topbar-title-input"
                        value={resumeTitle}
                        onChange={(e) => onResumeTitleChange(e.target.value)}
                        placeholder={targetRole ? `${targetRole} Resume` : "Resume title…"}
                        aria-label="Resume title"
                    />
                </div>

                {/* Inline status */}
                {saveMessage && (
                    <span className={`editor-topbar-status ${saveMessage === "Saved" ? "ok" : "err"}`} role="status">
                        {saveMessage}
                    </span>
                )}
                {downloadError && (
                    <span className="editor-topbar-status err" role="alert">{downloadError}</span>
                )}
            </div>

            {/* Right: action buttons */}
            <div className="editor-topbar-actions">
                {/* Save */}
                <button
                    type="button"
                    className="editor-action-btn"
                    onClick={onSave}
                    disabled={isSaving || isBusy}
                >
                    {isSaving ? "Saving…" : "Save"}
                </button>

                {/* Check ATS / score */}
                <button
                    type="button"
                    className={`editor-action-btn ${hasAtsScore ? "editor-action-btn--ats" : ""}`}
                    onClick={onCheckATS}
                >
                    {hasAtsScore ? `ATS: ${atsAnalysis.overallScore}/100` : "Check ATS"}
                </button>

                {/* Download dropdown */}
                <div className="editor-download-wrap" ref={dropdownRef}>
                    <button
                        type="button"
                        className="editor-action-btn editor-action-btn--primary"
                        onClick={() => setDownloadOpen((v) => !v)}
                        disabled={isBusy}
                        aria-haspopup="true"
                        aria-expanded={downloadOpen}
                    >
                        {isBusy
                            ? (isDownloadingPdf ? "PDF…" : "DOCX…")
                            : "Download"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {downloadOpen && (
                        <div className="editor-download-menu" role="menu">
                            <p className="editor-download-menu-label">Download Resume</p>
                            <button type="button" role="menuitem" className="editor-download-option" onClick={handlePdf}>
                                Download as PDF
                            </button>
                            <button type="button" role="menuitem" className="editor-download-option" onClick={handleDocx}>
                                Download as DOCX
                            </button>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <button
                    type="button"
                    className="editor-action-btn editor-action-btn--outline"
                    onClick={onPreview}
                >
                    Preview
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
