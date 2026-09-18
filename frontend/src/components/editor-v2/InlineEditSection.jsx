/*
 * InlineEditSection — thin wrapper that adds hover affordance to a section.
 *
 * Currently informational: paints a 1px hairline outline on hover and a small
 * "Edit" affordance in the top-right. The full click-to-expand flow is wired
 * through SectionEditSheet, which ResumeDocument renders at the page level.
 *
 * For slice 2 v1, sections still render via the existing Template components.
 * This wrapper is used inside ResumeDocument to add the hover affordance
 * around the template-rendered section blocks.
 */
import { useState } from "react";

export default function InlineEditSection({ sectionKey, title, onEdit, children }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            data-section-key={sectionKey}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative"
        >
            <div
                className="absolute inset-0 pointer-events-none rounded-[4px] transition-[outline-color,outline-width] duration-[var(--d-hover)] ease-[var(--ease-out)]"
                style={{
                    outline: hovered ? "1px dashed var(--rule-strong)" : "1px dashed transparent",
                    outlineOffset: "2px",
                }}
                aria-hidden="true"
            />
            {hovered && (
                <button
                    type="button"
                    onClick={() => onEdit?.(sectionKey)}
                    className="absolute -top-2 right-2 z-10 inline-flex items-center gap-1.5 h-6 px-2 rounded-[var(--r-button)] bg-[var(--paper)] border text-[var(--t-mono)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--ink-subtle)] transition-[transform,color,border-color] duration-[var(--d-press)] ease-[var(--ease-out)] active:scale-[0.97]"
                    style={{ borderColor: "var(--rule)" }}
                    aria-label={`Edit ${title}`}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M1 9l1.5-3.5L8 1l1 1L3.5 7.5 1 9z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                    Edit
                </button>
            )}
            {children}
        </div>
    );
}
