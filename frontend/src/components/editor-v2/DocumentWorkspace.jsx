/*
 * DocumentWorkspace — the v2 editor shell.
 * Topbar + TemplatePicker + SectionRail + ResumeDocument.
 * Chrome recedes. The preview is the work surface.
 */
import { useState } from "react";
import SectionRail from "./SectionRail";
import ResumeDocument from "./ResumeDocument";
import EditorTopbar from "./EditorTopbar";
import TemplatePicker from "./TemplatePicker";

export default function DocumentWorkspace({
    TemplateComponent,
    resumeData,
    templateName,
    templateId,
    templates,
    onChangeTemplate,
    isSaving,
    saveLabel = "Auto-saved",
    onExportPdf,
    onExportDocx,
    onSave,
    onSectionUpdate,
    renderSectionEditor,
    targetRole,
    onBack,
}) {
    const [activeKey, setActiveKey] = useState("summary");
    const [completedKeys, setCompletedKeys] = useState([]);

    const handleSelect = (key) => {
        setActiveKey(key);
    };

    return (
        <div className="flex flex-col page-bg" style={{ height: "100dvh" }}>
            <EditorTopbar
                resumeTitle={resumeData?.personalInfo?.name ? `${resumeData.personalInfo.name} — ${targetRole || "Resume"}` : "Untitled resume"}
                templateName={templateName}
                isSaving={isSaving}
                saveLabel={saveLabel}
                onSave={onSave}
                onExportPdf={onExportPdf}
                onExportDocx={onExportDocx}
                onBack={onBack}
            />

            <TemplatePicker
                templates={templates}
                activeId={templateId}
                onChange={onChangeTemplate}
            />

            <div className="flex flex-1 min-h-0">
                <SectionRail
                    activeKey={activeKey}
                    onSelect={handleSelect}
                    completedKeys={completedKeys}
                />
                <ResumeDocument
                    TemplateComponent={TemplateComponent}
                    resumeData={resumeData}
                    activeKey={activeKey}
                    onActiveChange={setActiveKey}
                    onSectionUpdate={onSectionUpdate}
                    renderSectionEditor={renderSectionEditor}
                />
            </div>
        </div>
    );
}
