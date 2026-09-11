import { Link } from "react-router-dom";
import { templates } from "../data/templates";
import "../styles/Home.css";

/* ── Small resume preview for the hero ─────────────────── */
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
                {["React", "Node.js", "Firebase", "Python", "SQL"].map((s) => (
                    <span key={s} className="rp-skill-tag">{s}</span>
                ))}
            </div>
        </div>
    );
}

/* ── Template thumbnail previews ────────────────────────── */
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

/* ── Main Component ─────────────────────────────────────── */
export default function Home() {
    const features = [
        {
            icon: "📄",
            title: "Smart Extraction",
            desc: "Upload a PDF or DOCX resume, or paste your information. ResumeAI organizes your information into structured sections.",
        },
        {
            icon: "🎯",
            title: "Role-Specific Resumes",
            desc: "Choose your target role and generate a resume focused on the experience and skills most relevant to that role.",
        },
        {
            icon: "✨",
            title: "Professional Templates",
            desc: "Choose from clean, modern resume templates designed for professional applications.",
        },
        {
            icon: "⬇️",
            title: "Edit & Export",
            desc: "Review your generated resume, make changes, and export it as PDF or DOCX.",
        },
    ];

    const steps = [
        { num: "01", title: "Upload or Paste", desc: "Provide your existing resume or career information." },
        { num: "02", title: "Choose Your Role", desc: "Select the job role you're targeting." },
        { num: "03", title: "Generate", desc: "ResumeAI organizes and generates role-specific content." },
        { num: "04", title: "Customize", desc: "Review and edit your resume using the editor." },
        { num: "05", title: "Download", desc: "Export your finished resume as PDF or DOCX." },
    ];

    return (
        <main className="home-page">
            {/* ── HERO ─────────────────────────────────── */}
            <section className="hero-section" aria-label="Hero">
                <div className="hero-inner">
                    <div className="hero-content">
                        <span className="hero-badge">AI-Powered Resume Builder</span>

                        <h1 className="hero-heading">
                            Build a Resume<br />
                            <span className="hero-heading-accent">That Gets You Noticed</span>
                        </h1>

                        <p className="hero-subtext">
                            Create a professional, job-specific resume from your existing
                            experience. Upload your resume or paste your information, choose
                            your target role, and let ResumeAI organize it into a polished
                            resume.
                        </p>

                        <nav className="hero-actions" aria-label="Primary actions">
                            <Link to="/create" className="btn-primary" aria-label="Create your resume">
                                Create My Resume
                            </Link>
                            <Link to="/templates" className="btn-secondary" aria-label="Explore templates">
                                Explore Templates
                            </Link>
                        </nav>
                    </div>

                    <div className="hero-visual" aria-hidden="true">
                        <ResumePreview />
                    </div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────── */}
            <section className="features-section" aria-labelledby="features-heading">
                <div className="home-container">
                    <div className="section-header">
                        <h2 id="features-heading" className="section-heading">
                            Everything You Need to Build a Better Resume
                        </h2>
                        <p className="section-subtext">
                            ResumeAI helps you turn your existing experience into a resume
                            tailored to the role you want.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((f) => (
                            <div key={f.title} className="feature-card">
                                <span className="feature-icon" aria-hidden="true">{f.icon}</span>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────── */}
            <section className="how-section" aria-labelledby="how-heading">
                <div className="home-container">
                    <div className="section-header">
                        <h2 id="how-heading" className="section-heading">
                            How ResumeAI Works
                        </h2>
                    </div>

                    <ol className="steps-row" aria-label="Steps to create a resume">
                        {steps.map((step, i) => (
                            <>
                                <li key={step.num} className="step-item">
                                    <div className="step-number" aria-hidden="true">{step.num}</div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-desc">{step.desc}</p>
                                </li>
                                {i < steps.length - 1 && (
                                    <div key={`conn-${i}`} className="step-connector" aria-hidden="true" />
                                )}
                            </>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ── TEMPLATES PREVIEW ─────────────────────── */}
            <section className="templates-section" aria-labelledby="templates-heading">
                <div className="home-container">
                    <div className="section-header">
                        <h2 id="templates-heading" className="section-heading">
                            Choose a Style That Fits You
                        </h2>
                        <p className="section-subtext">
                            Start with a professional template and customize it to your needs.
                        </p>
                    </div>

                    <div className="templates-preview-grid">
                        {templates.map((tmpl) => (
                            <article key={tmpl.id} className="template-preview-card">
                                {TEMPLATE_THUMBS[tmpl.id]}
                                <div className="template-info">
                                    <h3 className="template-name">{tmpl.name}</h3>
                                    <p className="template-desc">{tmpl.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="templates-cta">
                        <Link to="/templates" className="link-cta" aria-label="View all templates">
                            View All Templates →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────── */}
            <section className="final-cta-section" aria-labelledby="final-cta-heading">
                <div className="home-container">
                    <h2 id="final-cta-heading" className="final-cta-heading">
                        Ready to Build Your Resume?
                    </h2>
                    <p className="final-cta-subtext">
                        Turn your experience into a professional resume tailored to your
                        next opportunity.
                    </p>
                    <Link to="/create" className="btn-primary" aria-label="Create your resume now">
                        Create My Resume
                    </Link>
                </div>
            </section>
        </main>
    );
}