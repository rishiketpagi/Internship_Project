import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import { createResume, getResume, updateResume } from "../services/resumeService";
import { useToast } from "../components/ui/ToastContext";
import "../styles/ATSAnalysis.css";

const CATEGORY_CAPS = {
    keywordMatch: 30,
    relevantSkills: 25,
    resumeStructure: 15,
    experienceRelevance: 15,
    formatting: 10,
    completeness: 5,
};

const CATEGORY_LABELS = {
    keywordMatch: "Keyword Match",
    relevantSkills: "Relevant Skills",
    resumeStructure: "Resume Structure",
    experienceRelevance: "Experience Relevance",
    formatting: "Formatting",
    completeness: "Completeness",
};

function scoreColor(score) {
    if (score < 50) return "var(--clr-danger)";
    if (score < 75) return "var(--clr-warning)";
    return "var(--clr-success)";
}

function ScoreRing({ score }) {
    const color = scoreColor(score);
    const deg = (score / 100) * 360;
    return (
        <div className="ats-ring-wrap">
            <div
                className="ats-ring-bg"
                style={{
                    "--ats-deg": `${deg}deg`,
                    "--ats-color": color,
                }}
            >
                <div className="ats-ring-inner">
                    <span className="ats-ring-score">{score}</span>
                    <span className="ats-ring-denom">/ 100</span>
                </div>
            </div>
        </div>
    );
}

function CategoryBar({ label, score, max }) {
    const pct = Math.round((score / max) * 100);
    return (
        <div className="ats-cat-row">
            <div className="ats-cat-meta">
                <span className="ats-cat-label">{label}</span>
                <span className="ats-cat-score">{score} / {max}</span>
            </div>
            <div className="ats-cat-track">
                <div className="ats-cat-fill" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function ATSAnalysisPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const {
        resumeData,
        targetRole,
        jobDescription,
        prompt,
        templateId,
    } = location.state || {};

    const [atsAnalysis, setAtsAnalysis] = useState(location.state?.atsAnalysis || null);
    const [resumeId, setResumeId] = useState(location.state?.resumeId || null);
    const [savedResultLoaded, setSavedResultLoaded] = useState(!location.state?.resumeId);
    const [status, setStatus] = useState("idle"); // "idle" | "loading" | "error"
    const [errorMsg, setErrorMsg] = useState("");
    const { warning } = useToast();

    useEffect(() => {
        if (!user || !resumeId) {
            return undefined;
        }

        let active = true;

        async function loadSavedResult() {
            try {
                const savedResume = await getResume(user.uid, resumeId);
                if (active && savedResume?.atsAnalysis) {
                    setAtsAnalysis(savedResume.atsAnalysis);
                }
            } catch (error) {
                console.error("Failed to load saved ATS result:", error);
                if (active) setErrorMsg("Unable to load the last saved ATS score.");
            } finally {
                if (active) setSavedResultLoaded(true);
            }
        }

        loadSavedResult();

        return () => {
            active = false;
        };
    }, [resumeId, user]);

    const saveAnalysis = async (analysis) => {
        if (!user) {
            throw new Error("You must be signed in to save ATS results.");
        }

        const candidateName = resumeData?.personalInfo?.name?.trim() || "Resume";
        const resume = {
            title: location.state?.title || `${candidateName} - ${targetRole || "Resume"}`,
            resumeData,
            templateId,
            targetRole,
            jobDescription,
            prompt,
            atsAnalysis: analysis,
        };

        if (resumeId) {
            await updateResume(user.uid, resumeId, resume);
            return;
        }

        const newResumeId = await createResume(user.uid, resume);
        setResumeId(newResumeId);
    };

    const handleAnalyze = async () => {
        if (!resumeData) {
            setErrorMsg("Resume data is unavailable. Return to the editor and try again.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");
        try {
            const res = await fetch("http://localhost:5000/api/resumes/analyze-ats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData, targetRole, jobDescription }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Analysis failed.");
            }
            
            if (user) {
                try {
                    await saveAnalysis(data.atsAnalysis);
                } catch (saveErr) {
                    console.error("Failed to save analysis:", saveErr);
                }
            } else {
                warning("Sign in to save your ATS analysis for later.");
            }
            
            setAtsAnalysis(data.atsAnalysis);
            setStatus("idle");
        } catch (err) {
            console.error("ATS analysis error:", err);
            setErrorMsg("ATS analysis could not be completed. Your resume is still available.");
            setStatus("error");
        }
    };

    const handleBackToEditor = () => {
        const query = templateId ? `?template=${templateId}` : "";
        navigate(`/editor${query}`, {
            state: {
                resumeData,
                targetRole,
                jobDescription,
                prompt,
                atsAnalysis,
                templateId,
                resumeId,
            },
        });
    };

    const isLoading = status === "loading" || (Boolean(user && resumeId) && !savedResultLoaded);
    const lastScore = atsAnalysis?.overallScore;

    return (
        <main className="ats-page">
            <div className="ats-container">

                {/* ── Back link ── */}
                <button type="button" className="ats-back-link" onClick={handleBackToEditor} title="Back to Resume Editor">
                    ← Back to Resume Editor
                </button>

                {/* ── Page heading ── */}
                <header className="ats-page-header">
                    <div className="ats-page-title-row">
                        <h1 className="ats-page-title">ATS Compatibility</h1>
                        {lastScore != null && (
                            <div className="ats-last-score" aria-label={`Last ATS score: ${lastScore} out of 100`}>
                                <span>Last score</span>
                                <strong>{lastScore}<small>/100</small></strong>
                            </div>
                        )}
                    </div>
                    {targetRole && (
                        <p className="ats-page-subtitle">
                            Based on your selected role
                            {targetRole && <strong> — {targetRole}</strong>}
                            {jobDescription ? " and provided job description." : "."}
                        </p>
                    )}
                </header>

                <div className="ats-divider" />

                {/* ── Loading state ── */}
                {isLoading && (
                    <div className="ats-state-block">
                        <div className="ats-spinner-lg" aria-label="Analyzing" />
                        <p className="ats-state-title">Analyzing your resume&hellip;</p>
                        <p className="ats-state-desc">This usually takes a few seconds.</p>
                    </div>
                )}

                {/* ── Error state ── */}
                {!isLoading && status === "error" && (
                    <div className="ats-state-block">
                        <div className="ats-error-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <p className="ats-state-title">ATS analysis could not be completed.</p>
                        <p className="ats-state-desc">{errorMsg}</p>
                        <button type="button" className="ats-btn-primary" onClick={handleAnalyze}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* ── No analysis yet ── */}
                {!isLoading && status !== "error" && !atsAnalysis && (
                    <div className="ats-state-block">
                        <p className="ats-state-title">ATS analysis has not been completed yet.</p>
                        <p className="ats-state-desc">
                            Run an analysis to see how well your resume matches your target role.
                        </p>
                        <button type="button" className="ats-btn-primary" onClick={handleAnalyze}>
                            Analyze Resume
                        </button>
                    </div>
                )}

                {/* ── Results ── */}
                {!isLoading && atsAnalysis && (
                    <>
                        {/* Overall score */}
                        <section className="ats-score-section" aria-labelledby="ats-score-heading">
                            <ScoreRing score={atsAnalysis.overallScore} />
                            <p className="ats-score-label" id="ats-score-heading">
                                Latest saved ATS result
                            </p>
                        </section>

                        <div className="ats-divider" />

                        {/* Score breakdown */}
                        <section className="ats-section" aria-labelledby="ats-breakdown-heading">
                            <h2 className="ats-section-heading" id="ats-breakdown-heading">Score Breakdown</h2>
                            <div className="ats-categories">
                                {Object.entries(CATEGORY_CAPS).map(([key, max]) => (
                                    <CategoryBar
                                        key={key}
                                        label={CATEGORY_LABELS[key]}
                                        score={atsAnalysis.categories?.[key] ?? 0}
                                        max={max}
                                    />
                                ))}
                            </div>
                        </section>

                        <div className="ats-divider" />

                        {/* Keywords */}
                        <section className="ats-section" aria-labelledby="ats-kw-heading">
                            <h2 className="ats-section-heading" id="ats-kw-heading">Keywords</h2>

                            <div className="ats-kw-group">
                                <h3 className="ats-kw-title">Matched Keywords</h3>
                                {atsAnalysis.matchedKeywords?.length > 0 ? (
                                    <div className="ats-tags">
                                        {atsAnalysis.matchedKeywords.map((kw, i) => (
                                            <span key={i} className="ats-tag ats-tag-matched">{kw}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="ats-empty-note">No matched keywords identified.</p>
                                )}
                            </div>

                            <div className="ats-kw-group">
                                <h3 className="ats-kw-title">Missing Keywords</h3>
                                {atsAnalysis.missingKeywords?.length > 0 ? (
                                    <>
                                        <div className="ats-tags">
                                            {atsAnalysis.missingKeywords.map((kw, i) => (
                                                <span key={i} className="ats-tag ats-tag-missing">{kw}</span>
                                            ))}
                                        </div>
                                        <p className="ats-kw-note">
                                            Missing keywords are potential areas to consider only if you genuinely have the relevant knowledge or experience.
                                        </p>
                                    </>
                                ) : (
                                    <p className="ats-empty-note">No missing keywords identified.</p>
                                )}
                            </div>
                        </section>

                        <div className="ats-divider" />

                        {/* Strengths + Suggestions */}
                        <section className="ats-section" aria-labelledby="ats-feedback-heading">
                            <h2 className="ats-section-heading" id="ats-feedback-heading">Feedback</h2>

                            {atsAnalysis.strengths?.length > 0 && (
                                <div className="ats-feedback-group">
                                    <h3 className="ats-kw-title">Strengths</h3>
                                    <ul className="ats-list">
                                        {atsAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}

                            {atsAnalysis.suggestions?.length > 0 && (
                                <div className="ats-feedback-group">
                                    <h3 className="ats-kw-title">Suggestions</h3>
                                    <ul className="ats-list">
                                        {atsAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                        </section>

                        <div className="ats-divider" />

                        {/* Bottom actions */}
                        <div className="ats-actions">
                            <button type="button" className="ats-btn-secondary" onClick={handleBackToEditor} title="Back to Editor">
                                ← Back to Editor
                            </button>
                            <button type="button" className="ats-btn-primary" onClick={handleAnalyze} disabled={isLoading}>
                                Re-analyze Resume
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <p className="ats-disclaimer">
                            {atsAnalysis.disclaimer ||
                                "This score is an estimate based on RoleResume's evaluation criteria. Actual ATS results may vary depending on the employer's system."}
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}
