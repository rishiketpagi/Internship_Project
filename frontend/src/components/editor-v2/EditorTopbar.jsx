/*
 * EditorTopbar — single-line, 64px, fixed.
 * Logo · editable resume title · save indicator · DOCX · PDF.
 * Template name shows as a label (the picker below does the switching).
 */
import { useState } from "react";
import { Button } from "../ui";

export default function EditorTopbar({
    resumeTitle,
    templateName,
    isSaving = false,
    saveLabel = "Auto-saved",
    onSave,
    onExportPdf,
    onExportDocx,
    onBack,
}) {
    const [title, setTitle] = useState(resumeTitle || "Untitled resume");

    return (
        <header
            className="h-[var(--topbar-h)] shrink-0 flex items-center gap-4 px-5 border-b bg-[var(--paper)]"
            style={{ borderColor: "var(--rule)", zIndex: "var(--z-topbar)" }}
        >
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to dashboard"
                    className="p-1.5 -ml-1.5 rounded-[var(--r-input)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-soft)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}

            <div className="flex items-center gap-2 min-w-0">
                <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--ink-inverse)] text-[var(--t-mono)] font-semibold"
                    style={{ background: "var(--accent)" }}
                    aria-hidden="true"
                >
                    R
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Resume title"
                    className="bg-transparent border-0 outline-none text-[var(--t-body)] font-medium text-[var(--ink)] placeholder:text-[var(--ink-subtle)] focus:outline-none w-[180px] sm:w-[260px] truncate"
                    placeholder="Untitled resume"
                />
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[var(--t-small)] text-[var(--ink-subtle)]" aria-live="polite">
                <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: isSaving ? "var(--warn)" : "var(--ok)" }}
                    aria-hidden="true"
                />
                {isSaving ? "Saving" : saveLabel}
            </div>

            <div className="ml-auto flex items-center gap-2">
                {templateName && (
                    <span className="hidden md:inline text-[var(--t-mono)] text-[var(--ink-subtle)]">
                        {templateName}
                    </span>
                )}

                {onSave && (
                    <Button variant="ghost" size="sm" onClick={onSave}>
                        Save
                    </Button>
                )}
                {onExportDocx && (
                    <Button variant="ghost" size="sm" onClick={onExportDocx}>
                        DOCX
                    </Button>
                )}
                {onExportPdf && (
                    <Button variant="primary" size="sm" onClick={onExportPdf}>
                        Export PDF
                    </Button>
                )}
            </div>
        </header>
    );
}
