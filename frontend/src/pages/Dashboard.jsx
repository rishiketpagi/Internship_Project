import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import { getResumes } from "../services/resumeService";
import "../styles/Dashboard.css";

const QUICK_ACTIONS = [
    {
        icon: "📝",
        title: "Create Resume",
        desc: "Start a new resume from your information.",
        route: "/create",
        label: "Go to Create Resume",
    },
    {
        icon: "🎨",
        title: "Browse Templates",
        desc: "Explore professional resume designs.",
        route: "/templates",
        label: "Go to Templates",
    },
    {
        icon: "📂",
        title: "My Resumes",
        desc: "View and manage your saved resumes.",
        route: "/my-resumes",
        label: "Go to My Resumes",
    },
];

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [resumes, setResumes] = useState(null);

    useEffect(() => {
        let active = true;

        getResumes(user.uid)
            .then((resumes) => {
                if (active) setResumes(resumes);
            })
            .catch((error) => {
                console.error("Failed to load dashboard resumes:", error);
                if (active) setResumes([]);
            });

        return () => {
            active = false;
        };
    }, [user.uid]);

    const displayName = user?.displayName
        ? `, ${user.displayName.split(" ")[0]}`
        : "";
    const resumeCount = resumes?.length ?? null;
    const recentResumes = resumes?.slice(0, 3) ?? [];

    const formatUpdatedAt = (timestamp) => {
        if (!timestamp?.toDate) return "Not saved yet";

        return timestamp.toDate().toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <main className="dashboard-page">
            {/* ── Header ─────────────────────────────── */}
            <header className="dashboard-header">
                <div className="dashboard-header-inner">
                    <div>
                        <h1 className="dashboard-greeting">
                            Welcome back{displayName}
                        </h1>
                        <p className="dashboard-subtext">
                            Create and manage your resumes in one place.
                        </p>
                    </div>

                    <Link
                        to="/create"
                        className="dashboard-create-btn"
                        aria-label="Create a new resume"
                    >
                        + Create New Resume
                    </Link>
                </div>
            </header>

            <div className="dashboard-container">
                {/* ── Empty State ─────────────────────── */}
                {resumeCount === 0 && (
                    <section
                        className="dashboard-empty-state"
                        aria-label="No saved resumes"
                    >
                        <span className="empty-icon" aria-hidden="true">📄</span>
                        <h3 className="empty-heading">
                            You haven't saved any resumes yet.
                        </h3>
                        <p className="empty-desc">
                            Create your first resume and save it here.
                        </p>
                        <Link
                            to="/create"
                            className="btn-empty-cta"
                            aria-label="Create your first resume"
                        >
                            Create Your First Resume
                        </Link>
                    </section>
                )}

                {resumeCount > 0 && (
                    <section className="dashboard-resumes-section" aria-labelledby="recent-resumes-label">
                        <div className="dashboard-section-heading">
                            <h2 id="recent-resumes-label" className="dash-section-label">
                                Recent Resumes
                            </h2>
                            <Link to="/my-resumes" className="dashboard-view-all">
                                View all <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                        <div className="dashboard-resumes-grid">
                            {recentResumes.map((resume) => (
                                <article className="dashboard-resume-card" key={resume.resumeId}>
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
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Quick Actions ────────────────────── */}
                <section
                    className="quick-actions-section"
                    aria-labelledby="quick-actions-label"
                >
                    <h2 id="quick-actions-label" className="dash-section-label">
                        Quick Actions
                    </h2>

                    <nav className="quick-actions-grid" aria-label="Quick actions">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.route}
                                to={action.route}
                                className="quick-action-card"
                                aria-label={action.label}
                            >
                                <span className="qa-icon" aria-hidden="true">
                                    {action.icon}
                                </span>
                                <h3 className="qa-title">{action.title}</h3>
                                <p className="qa-desc">{action.desc}</p>
                                <span className="qa-arrow" aria-hidden="true">→</span>
                            </Link>
                        ))}
                    </nav>
                </section>
            </div>
        </main>
    );
}
