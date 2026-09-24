export default function ResumePreviewCanvas({ TemplateComponent, resumeData }) {
    return (
        <section className="resume-preview-canvas" aria-label="Resume preview">
            <TemplateComponent resumeData={resumeData} />
        </section>
    );
}
