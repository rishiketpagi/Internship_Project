/*
 * TemplatePicker — horizontal strip of 5 thumbnails above the preview.
 * Preview does the talking — the thumbnails ARE miniature renders of each
 * template, not abstract icons. Click to switch, hover for hint.
 *
 * Per v2 plan: 1 horizontal control bar; the user picks by sight.
 */
import { useState } from "react";

export default function TemplatePicker({ templates, activeId, onChange }) {
    return (
        <div
            className="border-b shrink-0"
            style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            aria-label="Choose a template"
        >
            <div className="max-w-[var(--max-w-content)] mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
                <span className="text-[var(--t-mono)] uppercase tracking-[0.16em] text-[var(--ink-subtle)] shrink-0">
                    Template
                </span>
                <ul className="flex items-center gap-2" role="listbox">
                    {templates.map((t) => (
                        <TemplateThumb
                            key={t.id}
                            template={t}
                            active={activeId === t.id}
                            onSelect={() => onChange?.(t.id)}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

function TemplateThumb({ template, active, onSelect }) {
    const [hovered, setHovered] = useState(false);
    const TemplateComponent = template.component;
    const showHint = hovered && !active;

    return (
        <li role="option" aria-selected={active}>
            <button
                type="button"
                onClick={onSelect}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className="group relative flex flex-col items-center gap-1.5 shrink-0"
                aria-label={`Switch to ${template.name} template`}
            >
                <span
                    className="block w-[88px] h-[112px] overflow-hidden rounded-[var(--r-input)] border bg-[var(--paper)] transition-[border-color,transform,box-shadow] duration-[var(--d-hover)] ease-[var(--ease-out)]"
                    style={{
                        borderColor: active ? "var(--accent)" : hovered ? "var(--ink-subtle)" : "var(--rule)",
                        boxShadow: active ? "0 0 0 2px var(--accent-soft)" : "none",
                        transform: hovered && !active ? "translateY(-1px)" : "translateY(0)",
                    }}
                >
                    <span
                        className="block origin-top-left"
                        style={{
                            transform: "scale(0.18)",
                            width: "210mm",
                            height: "297mm",
                            transformOrigin: "top left",
                            pointerEvents: "none",
                        }}
                    >
                        <TemplateComponent resumeData={{}} onSectionEdit={null} />
                    </span>
                </span>
                <span
                    className="text-[var(--t-mono)] font-medium"
                    style={{ color: active ? "var(--accent)" : "var(--ink-muted)" }}
                >
                    {template.name}
                </span>
                {showHint && template.hint && (
                    <span
                        className="absolute top-[124px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[var(--t-mono)] text-[var(--ink-muted)] bg-[var(--paper)] border rounded-[var(--r-input)] px-2 py-1 z-10"
                        style={{ borderColor: "var(--rule)" }}
                        role="tooltip"
                    >
                        {template.hint}
                    </span>
                )}
            </button>
        </li>
    );
}
