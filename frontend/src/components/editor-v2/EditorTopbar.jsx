/*
 * EditorTopbar — single-line, 64px, fixed.
 * Logo · editable resume title · save indicator · template name · export buttons.
 * No nav duplication. No eyebrow above sections.
 */
import { useState } from "react";
import { Button, Pill } from "../ui";

export default function EditorTopbar({
    resumeTitle,
    templateName,
    templates = [],
    onChangeTemplate,
    isSaving = false,
    saveLabel = "Auto-saved",
    onSave,
    onExportPdf,
    onExportDocx,
    onBack,
}) {
    const [showTemplateMenu, setShowTemplateMenu] = useState(false);
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
                    onBlur={() => {/* title persistence hook */}}
                    aria-label="Resume title"
                    className="bg-transparent border-0 outline-none text-[var(--t-body)] font-medium text-[var(--ink)] placeholder:text-[var(--ink-subtle)] focus:outline-none w-[200px] sm:w-[280px] truncate"
                    placeholder="Untitled resume"
                />
            </div>

            {/* save indicator */}
            <div className="flex items-center gap-2 text-[var(--t-small)] text-[var(--ink-subtle)]" aria-live="polite">
                <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: isSaving ? "var(--warn)" : "var(--ok)" }}
                    aria-hidden="true"
                />
                {isSaving ? "Saving" : saveLabel}
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* template picker */}
                {templates.length > 0 && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowTemplateMenu((s) => !s)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[var(--r-button)] text-[var(--t-small)] text-[var(--ink)] hover:bg-[var(--paper-soft)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]"
                            aria-haspopup="listbox"
                            aria-expanded={showTemplateMenu}
                        >
                            <span className="text-[var(--ink-subtle)]">Template</span>
                            <span className="font-medium">{templateName}</span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {showTemplateMenu && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close template menu"
                                    className="fixed inset-0 z-10 cursor-default"
                                    onClick={() => setShowTemplateMenu(false)}
                                    tabIndex={-1}
                                />
                                <ul
                                    className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[200px] py-1 bg-[var(--paper)] border rounded-[var(--r-card)] shadow-[var(--shadow-pop)]"
                                    style={{ borderColor: "var(--rule)" }}
                                    role="listbox"
                                >
                                    {templates.map((t) => (
                                        <li key={t.id} role="option" aria-selected={t.name === templateName}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onChangeTemplate?.(t.id);
                                                    setShowTemplateMenu(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-[var(--t-small)] text-[var(--ink)] hover:bg-[var(--paper-soft)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]"
                                            >
                                                {t.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
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
