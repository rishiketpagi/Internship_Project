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

            </div>

            {/* Right: action buttons */}
            <div className="editor-topbar-actions">
                {/* Check ATS / score */}
                <button
                    type="button"
                    className={`editor-action-btn editor-action-btn--ats-long ${hasAtsScore ? "scored" : ""}`}
                    onClick={onCheckATS}
                >
                    <span className="editor-ats-text">
                        {hasAtsScore ? `ATS Score: ${atsAnalysis.overallScore}/100` : "ATS not analyzed yet"}
                    </span>
                    <span className="editor-ats-arrow">→</span>
                </button>

                {/* Save */}
                <button
                    type="button"
                    className="editor-action-btn"
                    onClick={onSave}
                    disabled={isSaving || isBusy}
                >
                    {isSaving ? "Saving…" : "Save"}
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
            </div>
        </header>
    );
}
