import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { templates } from "../../data/templates";

const TEMPLATE_ACCENTS = {
    modern: { color: "#0ea5e9", label: "Modern" },
    professional: { color: "#6366f1", label: "Professional" },
    minimal: { color: "#10b981", label: "Minimal" },
    creative: { color: "#f59e0b", label: "Creative" },
    executive: { color: "#8b5cf6", label: "Executive" },
    classic: { color: "#ef4444", label: "Classic" },
};

function getAccent(templateId) {
    return TEMPLATE_ACCENTS[templateId?.toLowerCase()] ?? { color: "#0ea5e9", label: templateId || "Modern" };
}

function formatUpdatedAt(timestamp) {
    if (!timestamp?.toDate) return "Not saved yet";

    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 24) {
        return `at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays <= 2) {
        const days = Math.max(1, Math.floor(diffDays));
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return `on ${date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        })}`;
    }
}

export default function DashboardResumeCard({ resume }) {
    const selectedTemplate = templates.find((t) => t.id === (resume.templateId || "modern")) || templates[0];
    const TemplateComponent = selectedTemplate.component;
    const accent = getAccent(resume.templateId);
    
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.24);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                setScale(width / 794);
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);
    
    return (
        <article className="dashboard-resume-card" style={{ "--card-accent": accent.color }}>
            <div className="dashboard-resume-card-preview" ref={containerRef}>
                <div 
                    className="dashboard-resume-card-canvas"
                    style={{ transform: `scale(${scale})` }}
                >
                    <TemplateComponent resumeData={resume.resumeData} />
                </div>
            </div>
            
            <div className="dashboard-resume-card-content">
                {resume.targetRole && (
                    <span className="dashboard-resume-target-role">{resume.targetRole}</span>
                )}
                <h3 title={resume.title || "Untitled Resume"}>{resume.title || "Untitled Resume"}</h3>
                
                <div className="dashboard-resume-meta-badges">
                    <span className="dashboard-resume-template-badge">{accent.label}</span>
                    <span className="dashboard-resume-dot-separator">·</span>
                    {resume.atsAnalysis?.overallScore != null ? (
                        <span className="dashboard-resume-ats-badge">ATS {resume.atsAnalysis.overallScore}</span>
                    ) : (
                        <span className="dashboard-resume-ats-badge unanalyzed">Not analyzed</span>
                    )}
                </div>

                <p className="dashboard-resume-updated">Updated {formatUpdatedAt(resume.updatedAt)}</p>
                
                <Link
                    to={`/resume-preview?template=${resume.templateId || "modern"}`}
                    state={{ savedResume: resume }}
                    className="dashboard-resume-link"
                >
                    Open Resume <span>→</span>
                </Link>
            </div>
        </article>
    );
}
