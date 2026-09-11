import { Link } from "react-router-dom";

function formatUpdatedAt(timestamp) {
    if (!timestamp?.toDate) return "Not saved yet";

    return timestamp.toDate().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function DashboardResumeCard({ resume }) {
    return (
        <article className="dashboard-resume-card">
            <span className="dashboard-resume-card-label">
                {resume.templateId || "modern"} template
            </span>
            <h3>{resume.title || "Untitled Resume"}</h3>
            <p>Updated {formatUpdatedAt(resume.updatedAt)}</p>
            <Link
                to={`/editor?template=${resume.templateId || "modern"}`}
                state={{ savedResume: resume }}
                className="dashboard-resume-link"
            >
                Open resume <span aria-hidden="true">→</span>
            </Link>
        </article>
    );
}
