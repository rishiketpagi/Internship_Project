export default function ResumePreviewPanel({
    selectedTemplate,
    TemplateComponent,
    roleResumeData,
    resumeData,
    resumeRef,
    previewScale,
    onPreviewWheel,
    onChangeTemplate,
    onZoomChange,
    onResetZoom,
}) {
    return (
        <section className="resume-editor-preview-panel" onWheel={onPreviewWheel}>
            <div className="resume-editor-preview-controls">
                <div className="resume-editor-template-switcher" aria-label="Template selection">
                    <span className="resume-editor-control-label">Template</span>
                    <button type="button" onClick={() => onChangeTemplate(-1)} className="resume-editor-template-button" aria-label="Previous template">&lt;</button>
                    <span className="resume-editor-template-name" aria-live="polite">{selectedTemplate.name}</span>
                    <button type="button" onClick={() => onChangeTemplate(1)} className="resume-editor-template-button" aria-label="Next template">&gt;</button>
                </div>
                <div className="resume-editor-preview-toolbar" aria-label="Preview zoom controls">
                    <span className="resume-editor-control-label">Zoom</span>
                    <button type="button" onClick={() => onZoomChange(-0.05)} className="resume-editor-zoom-button" aria-label="Zoom out preview">-</button>
                    <span className="resume-editor-zoom-value">{Math.round(previewScale * 100)}%</span>
                    <button type="button" onClick={() => onZoomChange(0.05)} className="resume-editor-zoom-button" aria-label="Zoom in preview">+</button>
                    <button type="button" onClick={onResetZoom} className="resume-editor-zoom-reset">Reset</button>
                </div>
            </div>
            <div className="resume-editor-preview" style={{ "--preview-scale": previewScale }}>
                <div ref={resumeRef}>
                    <TemplateComponent
                        roleResumeData={
                            roleResumeData
                                ? { ...roleResumeData, candidateProfile: resumeData }
                                : undefined
                        }
                        resumeData={resumeData}
                    />
                </div>
            </div>
        </section>
    );
}
