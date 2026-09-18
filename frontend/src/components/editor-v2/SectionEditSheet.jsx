/*
 * SectionEditSheet — bottom-anchored sheet that opens when the user clicks
 * "Edit" on a section in the preview. Not a permanent side pane.
 * Origin-aware enter (slides up from bottom), backdrop scrim, ESC to close.
 *
 * Per v2 plan: chrome that recedes. The sheet appears only when invoked,
 * not as a permanent column. Animation is rare (this is a low-frequency action).
 */
import { useEffect, useRef } from "react";

export default function SectionEditSheet({ sectionKey, title, children, onClose }) {
    const sheetRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        previousFocusRef.current = document.activeElement;
        // focus first focusable inside the sheet
        const first = sheetRef.current?.querySelector(
            'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            previousFocusRef.current?.focus?.();
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex items-end sm:items-center justify-center"
            style={{ zIndex: "var(--z-modal)" }}
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${title}`}
        >
            {/* scrim */}
            <button
                type="button"
                aria-label="Close edit panel"
                onClick={onClose}
                className="absolute inset-0 bg-[oklch(0.18_0.01_60_/_0.32)] animate-[toast-in_var(--d-toast)_var(--ease-out)_1] cursor-default"
                tabIndex={-1}
            />

            {/* sheet */}
            <div
                ref={sheetRef}
                className="relative w-full sm:max-w-[640px] sm:max-h-[80dvh] max-h-[85dvh] bg-[var(--paper)] rounded-t-[var(--r-surface)] sm:rounded-[var(--r-surface)] shadow-[var(--shadow-pop)] flex flex-col"
                style={{
                    transformOrigin: "center bottom",
                    animation: "sheet-in var(--d-reveal) var(--ease-out) 1",
                }}
            >
                <div
                    className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                    style={{ borderColor: "var(--rule)" }}
                >
                    <div>
                        <p className="text-[var(--t-mono)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                            Edit
                        </p>
                        <h2 className="text-[var(--t-h3)] font-medium text-[var(--ink)] mt-0.5">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-2 rounded-[var(--r-input)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-soft)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            </div>

            <style>{`
                @keyframes sheet-in {
                    from { opacity: 0; transform: translateY(16px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
