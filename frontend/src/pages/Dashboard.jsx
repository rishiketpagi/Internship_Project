/*
 * Dashboard — v2 lean.
 * Greeting + create button + resume list. Nothing else.
 * No card clutter. No QuickActions widget. No "01 / 02" step strips.
 */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import DashboardResumeCard from "../components/dashboard/DashboardResumeCard";
import { getResumes } from "../services/resumeService";
import { Button, Pill } from "../components/ui";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [resumes, setResumes] = useState(null);

    useEffect(() => {
        let active = true;
        getResumes(user.uid)
            .then((items) => { if (active) setResumes(items); })
            .catch((err) => { console.error(err); if (active) setResumes([]); });
        return () => { active = false; };
    }, [user.uid]);

    const firstName = user?.displayName?.split?.(" ")[0];
    const greeting = firstName ? `Hi, ${firstName}` : "Your resumes";
    const resumeCount = resumes?.length ?? null;

    return (
        <main className="page-bg min-h-[100dvh]">
            <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10 py-12">
                <header className="flex items-end justify-between gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                            {greeting}
                        </h1>
                        <p className="text-[var(--t-body)] text-[var(--ink-muted)]">
                            {resumeCount === null
                                ? "Loading your resumes"
                                : resumeCount === 0
                                    ? "Start your first resume"
                                    : `${resumeCount} resume${resumeCount === 1 ? "" : "s"}`}
                        </p>
                    </div>
                    <Link to="/create">
                        <Button size="md">+ New resume</Button>
                    </Link>
                </header>

                {/* Loading skeleton */}
                {resumeCount === null && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-[180px] rounded-[var(--r-card)] border"
                                style={{
                                    borderColor: "var(--rule)",
                                    background: "linear-gradient(90deg, var(--paper-soft) 0%, var(--paper) 50%, var(--paper-soft) 100%)",
                                    backgroundSize: "200% 100%",
                                    animation: "pulse-soft 1.6s ease-in-out infinite",
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {resumeCount === 0 && (
                    <div className="flex flex-col items-center text-center py-20 gap-4">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ background: "var(--paper-soft)" }}
                            aria-hidden="true"
                        >
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <rect x="4" y="3" width="14" height="16" rx="1.5" stroke="var(--ink-muted)" strokeWidth="1.5" />
                                <path d="M7 8h8M7 12h8M7 16h5" stroke="var(--ink-muted)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-2 max-w-[40ch]">
                            <h2 className="text-[var(--t-h3)] font-medium text-[var(--ink)]">No resumes yet</h2>
                            <p className="text-[var(--t-body)] text-[var(--ink-muted)]">
                                Start a new resume from scratch or upload an existing one to edit.
                            </p>
                        </div>
                        <Link to="/create">
                            <Button size="md" className="mt-2">Start your first resume</Button>
                        </Link>
                    </div>
                )}

                {/* Resumes list */}
                {resumeCount > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resumes.map((resume) => (
                            <DashboardResumeCard key={resume.resumeId} resume={resume} />
                        ))}
                    </div>
                )}

                {/* Tiny status strip at bottom */}
                {resumeCount > 0 && (
                    <div className="mt-10 flex items-center gap-2 text-[var(--t-mono)] text-[var(--ink-subtle)]">
                        <Pill variant="ok">Synced</Pill>
                        <span>Last sync just now</span>
                    </div>
                )}
            </div>
        </main>
    );
}
