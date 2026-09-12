import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import DashboardResumeCard from "../components/dashboard/DashboardResumeCard";
import QuickActions from "../components/dashboard/QuickActions";
import { getResumes } from "../services/resumeService";
import "../styles/Dashboard.css";

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
                                <DashboardResumeCard key={resume.resumeId} resume={resume} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Quick Actions ────────────────────── */}
                <QuickActions />
            </div>
        </main>
    );
}
