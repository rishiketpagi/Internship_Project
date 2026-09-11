function ResumePreview() {
    return (
        <div className="resume-preview-card">
            <div className="rp-header">
                <p className="rp-name">Alex Johnson</p>
                <p className="rp-title">Software Engineer</p>
                <p className="rp-contact">alex@email.com · linkedin · github</p>
            </div>
            <p className="rp-section-heading">Professional Summary</p>
            <div className="rp-line long" />
            <div className="rp-line medium" />
            <div className="rp-line short" />
            <p className="rp-section-heading">Experience</p>
            <div className="rp-line medium" />
            <div className="rp-line long" />
            <div className="rp-line short" />
            <p className="rp-section-heading">Projects</p>
            <div className="rp-line long" />
            <div className="rp-line medium" />
            <p className="rp-section-heading">Skills</p>
            <div className="rp-skills">
                {["React", "Node.js", "Firebase", "Python", "SQL"].map((skill) => (
                    <span key={skill} className="rp-skill-tag">{skill}</span>
                ))}
            </div>
        </div>
    );
}

function ProfessionalThumb() {
    return (
        <div className="template-thumbnail thumb-professional">
            <div className="thumb-header">
                <p className="thumb-name">Alex Johnson</p>
                <p className="thumb-contact">email · phone · linkedin</p>
            </div>
            <p className="thumb-section-label">Professional Summary</p>
            <div className="thumb-line long" />
            <div className="thumb-line medium" />
            <p className="thumb-section-label">Experience</p>
            <div className="thumb-line medium" />
            <div className="thumb-line long" />
            <div className="thumb-line short" />
            <p className="thumb-section-label">Skills</p>
            <div className="thumb-line long" />
        </div>
    );
}

function ModernThumb() {
    return (
        <div className="template-thumbnail thumb-modern">
            <div className="thumb-top-band">
                <p className="thumb-name">Alex Johnson</p>
                <p className="thumb-contact">email · phone · linkedin</p>
            </div>
            <p className="thumb-section-label">Experience</p>
            <div className="thumb-left-bar">
                <div className="thumb-line medium" />
                <div className="thumb-line long" />
            </div>
            <p className="thumb-section-label">Projects</p>
            <div className="thumb-left-bar">
                <div className="thumb-line long" />
                <div className="thumb-line short" />
            </div>
            <p className="thumb-section-label">Skills</p>
            <div className="thumb-line medium" />
        </div>
    );
}

function MinimalThumb() {
    return (
        <div className="template-thumbnail thumb-minimal">
            <p className="thumb-name">Alex Johnson</p>
            <p className="thumb-contact">email · phone · location</p>
            <p className="thumb-section-label">Experience</p>
            <div className="thumb-line medium" />
            <div className="thumb-line long" />
            <div className="thumb-line short" />
            <p className="thumb-section-label">Education</p>
            <div className="thumb-line medium" />
            <div className="thumb-line long" />
            <p className="thumb-section-label">Skills</p>
            <div className="thumb-line long" />
        </div>
    );
}

const TEMPLATE_THUMBS = {
    professional: <ProfessionalThumb />,
    modern: <ModernThumb />,
    minimal: <MinimalThumb />,
};

export function HomeHeroVisual() {
    return <ResumePreview />;
}

export function TemplateThumb({ templateId }) {
    return TEMPLATE_THUMBS[templateId];
}

