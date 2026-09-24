import React, { useState, useRef, useEffect } from "react";
import { templates } from "../../data/templates";

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
    kebab: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
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
    onAnalyze,
}) {
    const accent = getAccent(resume.templateId);
    const selectedTemplate = templates.find((t) => t.id === (resume.templateId || "modern")) || templates[0];
    const TemplateComponent = selectedTemplate.component;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    return (
        <article
            className="my-resume-card"
            style={{ "--card-accent": accent.color }}
            onClick={(event) => {
                if (!event.target.closest("button, input, .my-resume-dropdown")) onPreview();
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter" && event.target === event.currentTarget) onPreview();
            }}
            tabIndex={0}
        >
            <div className="my-resume-card-content">
                {/* Left side: Thumbnail */}
                <div className="my-resume-card-left">
                    <div className="my-resume-card-thumbnail" aria-hidden="true">
                        <div className="my-resume-card-preview-scale">
                            <TemplateComponent resumeData={resume.resumeData} />
                        </div>
                    </div>
                </div>

                {/* Right side: Info */}
                <div className="my-resume-card-right">
                    <h3 className="my-resume-target-role" title="Target Role">
                        {resume.targetRole || "General Resume"}
                    </h3>

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
                            <span className="my-resume-custom-title" title={resume.title || "Untitled Resume"}>
                                {resume.title || "Untitled Resume"}
                            </span>
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

                    {resume.atsAnalysis?.overallScore != null ? (
                        <button
                            type="button"
                            className="my-resume-ats-score"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAnalyze?.();
                            }}
                            title="View ATS Analysis"
                        >
                            ATS {resume.atsAnalysis.overallScore}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="my-resume-ats-score unanalyzed"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAnalyze?.();
                            }}
                            title="Analyze this resume"
                        >
                            Not analyzed yet
                        </button>
                    )}

                    <div className="my-resume-meta-bottom">
                        <span className="my-resume-template-text" style={{ color: accent.color }}>
                            {accent.label} Template
                        </span>
                        <span className="my-resume-date" title={resume.updatedAt?.toDate?.().toLocaleString?.()}>
                            {relativeDate(resume.updatedAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="my-resume-divider" />

            {/* Actions Footer */}
            <div className="my-resume-card-footer">
                <div className="my-resume-main-actions">
                    <button
                        type="button"
                        className="my-resume-action-btn my-resume-action-primary"
                        onClick={(event) => {
                            event.stopPropagation();
                            onEdit();
                        }}
                    >
                        {Icons.edit} Edit Resume
                    </button>
                    <button
                        type="button"
                        className="my-resume-action-btn my-resume-action-secondary"
                        onClick={(event) => {
                            event.stopPropagation();
                            onDownload();
                        }}
                    >
                        {Icons.download} Download
                    </button>
                </div>

                <div className="my-resume-options-container" ref={menuRef}>
                    <button
                        type="button"
                        className="my-resume-options-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        aria-label="Options"
                    >
                        {Icons.kebab}
                    </button>

                    {isMenuOpen && (
                        <div className="my-resume-dropdown">
                            <button
                                type="button"
                                className="my-resume-dropdown-item"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsMenuOpen(false);
                                    onDuplicate();
                                }}
                            >
                                {Icons.duplicate} Duplicate
                            </button>
                            <button
                                type="button"
                                className="my-resume-dropdown-item danger"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsMenuOpen(false);
                                    onDelete();
                                }}
                            >
                                {Icons.trash} Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
