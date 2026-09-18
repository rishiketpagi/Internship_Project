/*
 * ResumeDocument — the preview pane that IS the workspace.
 * Renders the template (existing React tree).
 * Wraps each section with an InlineEditSection so hover → hairline + edit button,
 * click → in-place expansion (sheet anchored to section).
 *
 * Per v2 plan: the preview is the document. No motion on typing.
 * Template-switch uses crossfade with 2px blur bridge (the ONLY motion moment).
 *
 * The forwarded ref attaches to the inner template wrapper so html2pdf can
 * capture exactly the printable surface (not the scroll container).
 */
import { forwardRef, useState, useCallback } from "react";
import SectionEditSheet from "./SectionEditSheet";

const SECTION_TITLES = {
    personalInfo: "Personal",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    achievements: "Achievements",
};

const ResumeDocument = forwardRef(function ResumeDocument(
    {
        TemplateComponent,
        resumeData,
        activeKey,
        onActiveChange,
        renderSectionEditor,
    },
    ref
) {
    const [editingKey, setEditingKey] = useState(null);

    const handleSelect = useCallback((key) => {
        onActiveChange?.(key);
        const target = document.querySelector(`[data-section-key="${key}"]`);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [onActiveChange]);

    const handleEdit = useCallback((key) => {
        setEditingKey(key);
    }, []);

    const handleCloseSheet = useCallback(() => {
        setEditingKey(null);
    }, []);

    return (
        <div className="relative flex-1 min-w-0 overflow-auto bg-[var(--paper)]">
            {/* ref attaches to the printable surface, used by html2pdf in the page */}
            <div
                ref={ref}
                className="mx-auto my-8 transition-[filter,opacity] duration-[var(--d-template)] ease-[var(--ease-in-out)]"
                style={{
                    width: "min(816px, calc(100% - 64px))",
                    background: "var(--paper)",
                }}
            >
                <TemplateComponent resumeData={resumeData} />

                {/* overlay markers for each section (used for inline edit anchors) */}
                {Object.keys(SECTION_TITLES).map((key) => (
                    <span
                        key={key}
                        data-section-key={key}
                        className="sr-only"
                    />
                ))}
            </div>

            {editingKey && renderSectionEditor && (
                <SectionEditSheet
                    sectionKey={editingKey}
                    title={SECTION_TITLES[editingKey] || editingKey}
                    onClose={handleCloseSheet}
                >
                    {renderSectionEditor(editingKey)}
                </SectionEditSheet>
            )}
        </div>
    );
});

export default ResumeDocument;
