/*
 * SectionRail — collapsible left rail for the document workspace.
 * 200px expanded (icon + label), 56px collapsed (icon only).
 * Active section: 2px cobalt left border + ink text.
 * Inactive: muted ink. No card containers.
 */
import { useState } from "react";

const SECTIONS = [
    { key: "personalInfo", label: "Personal", glyph: "user" },
    { key: "summary", label: "Summary", glyph: "lines" },
    { key: "experience", label: "Experience", glyph: "briefcase" },
    { key: "education", label: "Education", glyph: "cap" },
    { key: "projects", label: "Projects", glyph: "code" },
    { key: "skills", label: "Skills", glyph: "spark" },
    { key: "certifications", label: "Certs", glyph: "seal" },
    { key: "achievements", label: "Awards", glyph: "star" },
];

function Glyph({ name }) {
    const stroke = "currentColor";
    const sw = 1.5;
    switch (name) {
        case "user":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="5.5" r="2.75" stroke={stroke} strokeWidth={sw} />
                    <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                </svg>
            );
        case "lines":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                </svg>
            );
        case "briefcase":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="2" y="5" width="12" height="8" rx="1" stroke={stroke} strokeWidth={sw} />
                    <path d="M6 5V3.5h4V5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                </svg>
            );
        case "cap":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 3l6 2.5L8 8 2 5.5 8 3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                    <path d="M4.5 7v3.5c0 1 1.5 2 3.5 2s3.5-1 3.5-2V7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                </svg>
            );
        case "code":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case "spark":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2.5 2.5M9.5 9.5L12 12M4 12l2.5-2.5M9.5 6.5L12 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                </svg>
            );
        case "seal":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="5.25" stroke={stroke} strokeWidth={sw} />
                    <path d="M8 5.5v5M5.5 8h5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
                </svg>
            );
        case "star":
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2.5l1.6 3.6 3.9.4-2.9 2.7.8 3.8L8 11.1l-3.4 1.9.8-3.8L2.5 6.5l3.9-.4L8 2.5z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
                </svg>
            );
        default:
            return null;
    }
}

export default function SectionRail({ activeKey, onSelect, completedKeys = [] }) {
    const [collapsed, setCollapsed] = useState(false);
    const w = collapsed ? "var(--rail-w-collapsed)" : "var(--rail-w)";

    return (
        <aside
            className="border-r shrink-0 flex flex-col bg-[var(--paper)] transition-[width] duration-[var(--d-hover)] ease-[var(--ease-out)]"
            style={{
                width: w,
                borderColor: "var(--rule)",
                zIndex: "var(--z-rail)",
                height: "calc(100dvh - var(--topbar-h))",
            }}
            aria-label="Resume sections"
        >
            <div className="flex items-center justify-between px-3 h-12 border-b" style={{ borderColor: "var(--rule)" }}>
                {!collapsed && (
                    <span className="text-[var(--t-mono)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                        Sections
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={collapsed ? "Expand section rail" : "Collapse section rail"}
                    aria-expanded={!collapsed}
                    className="ml-auto p-1.5 rounded-[var(--r-input)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-soft)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                            d={collapsed ? "M4.5 2.5L8.5 7l-4 4.5" : "M9.5 2.5L5.5 7l4 4.5"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
                <ul className="flex flex-col">
                    {SECTIONS.map((section) => {
                        const isActive = activeKey === section.key;
                        const isComplete = completedKeys.includes(section.key);
                        return (
                            <li key={section.key} className="relative">
                                {/* active left border */}
                                <span
                                    aria-hidden="true"
                                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-[1px] transition-opacity duration-[var(--d-hover)] ease-[var(--ease-out)]"
                                    style={{
                                        background: "var(--accent)",
                                        opacity: isActive ? 1 : 0,
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onSelect?.(section.key)}
                                    aria-current={isActive ? "true" : undefined}
                                    className={[
                                        "w-full flex items-center gap-3",
                                        collapsed ? "justify-center px-0" : "px-4",
                                        "h-10",
                                        "text-[var(--t-body)]",
                                        "transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]",
                                        isActive
                                            ? "text-[var(--ink)] font-medium"
                                            : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-soft)]",
                                    ].join(" ")}
                                    title={collapsed ? section.label : undefined}
                                >
                                    <span className={isActive ? "text-[var(--accent)]" : ""}>
                                        <Glyph name={section.glyph} />
                                    </span>
                                    {!collapsed && <span className="truncate">{section.label}</span>}
                                    {!collapsed && isComplete && (
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            aria-label="Completed"
                                            className="ml-auto text-[var(--ok)]"
                                        >
                                            <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {!collapsed && (
                <div className="border-t px-4 py-3 text-[var(--t-mono)] text-[var(--ink-subtle)]" style={{ borderColor: "var(--rule)" }}>
                    {SECTIONS.length} sections
                </div>
            )}
        </aside>
    );
}

export { SECTIONS };
