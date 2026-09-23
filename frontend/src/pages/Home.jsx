import { Link } from "react-router-dom";
import { TemplateThumb } from "../components/common/HomeVisuals";
import { templates } from "../data/templates";
import { features, steps } from "../data/homeData";
import "../styles/Home.css";

function FeatureCard({ feature }) {
    return (
        <article className="feature-card">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
        </article>
    );
}

function HowItWorksStep({ step }) {
    return (
        <li className="step-item">
            <div className="step-number" aria-hidden="true">{step.num}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
        </li>
    );
}

function TemplatePreviewCard({ template }) {
    return (
        <article className="template-preview-card">
            <TemplateThumb templateId={template.id} />
            <div className="template-info">
                <h3 className="template-name">{template.name}</h3>
                <Link to={`/create?template=${template.id}`} className="btn-use-template">
                    Use Template
                </Link>
            </div>
        </article>
    );
}

export default function Home() {
    return (
        <main className="home-page">
            {/* Hero Section */}
            <section className="hero-section" aria-labelledby="hero-heading">
                {/* Decorative background elements */}
                <div className="hero-bg-glow glow-1" aria-hidden="true" />
                <div className="hero-bg-glow glow-2" aria-hidden="true" />

                <div className="home-container hero-inner">
                    <div className="hero-content">

                        <h1 id="hero-heading" className="hero-heading">
                            Build a Resume That <br />
                            <span className="hero-heading-accent">Fits the Role</span>
                        </h1>
                        <p className="hero-subtext">
                            Create a professional, role-specific resume using the experience and information you already have.
                        </p>
                        <p className="hero-subtext-secondary">
                            Upload your existing resume or paste your information, select a target role, and let ResumeAI organize and tailor your resume for maximum impact.
                        </p>
                        <div className="hero-actions" aria-label="Primary actions">
                            <Link to="/create" className="btn-primary" aria-label="Create your resume">
                                Create My Resume
                            </Link>
                            <Link to="/templates" className="btn-secondary" aria-label="Explore resume templates">
                                Explore Templates
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-section" aria-labelledby="how-heading">
                <div className="home-container">
                    <div className="section-header">
                        <h2 id="how-heading" className="section-heading">How ResumeAI Works</h2>
                        <p className="section-subtext">Create your role-specific resume through a simple guided workflow.</p>
                    </div>
                    <ol className="steps-row" aria-label="Steps to create a resume">
                        {steps.map((step, index) => (
                            <li key={step.num} className="step-wrapper">
                                <HowItWorksStep step={step} />
                                {index < steps.length - 1 && <div className="step-connector" aria-hidden="true" />}
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" aria-labelledby="features-heading">
                <div className="home-container">
                    <div className="section-header">
                        <h2 id="features-heading" className="section-heading">Everything You Need to Build Your Resume</h2>
                    </div>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} feature={feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Preview Section */}
            <section className="templates-section" aria-labelledby="templates-heading">

                <div className="home-container">
                    <div className="section-header">
                        <h2 id="templates-heading" className="section-heading">Choose Your Resume Style</h2>
                        <p className="section-subtext">Clean, professional templates designed to remain ATS-friendly.</p>
                    </div>
                    <Link to="/templates" className="btn-secondary" aria-label="View all resume templates">
                        View All Templates
                    </Link>
                    <div className="templates-preview-grid">
                        {templates.map((template) => (
                            <TemplatePreviewCard key={template.id} template={template} />
                        ))}
                    </div>
                    <div className="templates-cta">
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            {/* <section className="final-cta-section" aria-labelledby="final-cta-heading">
                <div className="home-container">
                    <h2 id="final-cta-heading" className="final-cta-heading">Ready to Build Your Resume?</h2>
                    <p className="final-cta-subtext">Start with the resume information you already have.</p>
                    <Link to="/create" className="btn-primary btn-large" aria-label="Create your resume now">
                        Create My Resume
                    </Link>
                </div>
            </section> */}
        </main>
    );
}