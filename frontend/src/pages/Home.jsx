/*
 * Landing page — v2.
 * 4 sections, 3 layout families.
 * 1. Asymmetric hero (text left, live resume preview right)
 * 2. Editor showcase (centered, with stylized preview mock)
 * 3. Pricing (centered, 2 tiers, asymmetric)
 * 4. Footer (single line, minimal)
 *
 * Anti-patterns enforced:
 * - No eyebrow above every section
 * - No "01 / 02 / 03" number scaffolds
 * - No emoji icons
 * - No "AI-Powered" badges
 * - No decoration text strip
 * - No scroll cues
 */
import { Link } from "react-router-dom";
import ModernTemplate from "../components/templates/ModernTemplate";
import { templates } from "../data/templates";
import { sampleResumeData } from "../data/sampleResumeData";
import { Button } from "../components/ui";

export default function Home() {
    return (
        <main className="page-bg">
            {/* ── 1. HERO ─────────────────────────────── */}
            <section className="relative overflow-hidden" aria-labelledby="hero-heading">
                <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <h1 id="hero-heading" className="text-[var(--t-display)] font-medium tracking-[var(--ls-display)] leading-[var(--lh-display)] text-[var(--ink)]">
                            A resume is a document. We treat it like one.
                        </h1>
                        <p className="text-[var(--t-body)] text-[var(--ink-muted)] max-w-[52ch]">
                            Build a clean, focused resume in a workspace that respects your work. Pick a template, edit in place, export as PDF.
                        </p>
                        <nav className="flex items-center gap-3 mt-2" aria-label="Primary actions">
                            <Link to="/create">
                                <Button size="lg">Start a resume</Button>
                            </Link>
                            <Link to="/signin">
                                <Button variant="ghost" size="lg">Sign in</Button>
                            </Link>
                        </nav>
                    </div>

                    <div className="lg:col-span-7 lg:pl-6">
                        <div
                            className="rounded-[var(--r-surface)] overflow-hidden border bg-[var(--paper)] transition-[transform] duration-[var(--d-hover)] ease-[var(--ease-out)] hover:-translate-y-0.5"
                            style={{
                                borderColor: "var(--rule)",
                                boxShadow: "var(--shadow-pop)",
                            }}
                        >
                            <div className="flex items-center gap-1.5 px-4 h-9 border-b" style={{ borderColor: "var(--rule)" }}>
                                <span className="w-2 h-2 rounded-full" style={{ background: "#fb7185" }} />
                                <span className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} />
                                <span className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} />
                                <span className="ml-3 text-[var(--t-mono)] text-[var(--ink-subtle)]">resume — preview</span>
                            </div>
                            <div className="bg-white">
                                <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "210mm", height: "297mm" }}>
                                    <ModernTemplate resumeData={sampleResumeData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. EDITOR SHOWCASE ────────────────────── */}
            <section className="border-y" style={{ borderColor: "var(--rule)", background: "var(--paper-soft)" }} aria-labelledby="showcase-heading">
                <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 flex flex-col gap-5">
                        <h2 id="showcase-heading" className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                            The resume is the workspace.
                        </h2>
                        <p className="text-[var(--t-body)] text-[var(--ink-muted)] max-w-[52ch]">
                            No sidebar of form fields fighting for attention. Hover any section in the preview and edit it in place. What you see is what gets exported.
                        </p>
                        <ul className="flex flex-col gap-3 mt-2 text-[var(--t-body)] text-[var(--ink)]">
                            {[
                                "Five templates tuned for ATS and recruiter scanning.",
                                "Auto-save to your account. Edit from any device.",
                                "Export to PDF or DOCX. Same render both ways.",
                            ].map((line) => (
                                <li key={line} className="flex items-start gap-3">
                                    <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} aria-hidden="true" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-7">
                        <div
                            className="rounded-[var(--r-surface)] overflow-hidden border bg-[var(--paper)]"
                            style={{ borderColor: "var(--rule)", boxShadow: "var(--shadow-pop)" }}
                        >
                            <div className="flex items-center gap-3 px-4 h-[var(--topbar-h)] border-b" style={{ borderColor: "var(--rule)" }}>
                                <span
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--ink-inverse)] text-[var(--t-mono)] font-semibold"
                                    style={{ background: "var(--accent)" }}
                                    aria-hidden="true"
                                >
                                    R
                                </span>
                                <span className="text-[var(--t-body)] font-medium text-[var(--ink)]">Rishiket — Software Engineer</span>
                                <span className="ml-auto text-[var(--t-small)] text-[var(--ink-subtle)]">Auto-saved</span>
                            </div>
                            <div className="flex" style={{ minHeight: "360px" }}>
                                <div className="w-[200px] border-r shrink-0 py-2" style={{ borderColor: "var(--rule)" }}>
                                    {["Summary", "Experience", "Education", "Projects", "Skills"].map((label, i) => (
                                        <div
                                            key={label}
                                            className="px-4 h-10 flex items-center gap-3 text-[var(--t-body)] relative"
                                            style={{
                                                color: i === 1 ? "var(--ink)" : "var(--ink-muted)",
                                                background: i === 1 ? "var(--paper-soft)" : "transparent",
                                                fontWeight: i === 1 ? 500 : 400,
                                            }}
                                        >
                                            {i === 1 && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute left-0 top-2 bottom-2 w-0.5"
                                                    style={{ background: "var(--accent)" }}
                                                />
                                            )}
                                            <span className={i === 1 ? "text-[var(--accent)]" : ""}>
                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                                    <rect x="2" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M6 5V3.5h4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </span>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 p-6 overflow-hidden">
                                    <div className="max-w-[420px] bg-white p-6 border mx-auto" style={{ borderColor: "#e5e7eb" }}>
                                        <div style={{ transform: "scale(0.34)", transformOrigin: "top left", width: "210mm", height: "297mm" }}>
                                            <ModernTemplate resumeData={sampleResumeData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. PRICING ───────────────────────────── */}
            <section className="py-20" aria-labelledby="pricing-heading">
                <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10 flex flex-col gap-10">
                    <header className="flex flex-col gap-3 max-w-[60ch]">
                        <h2 id="pricing-heading" className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                            Two tiers. No surprises.
                        </h2>
                        <p className="text-[var(--t-body)] text-[var(--ink-muted)]">
                            Free for everything except PDF export. PDF export is on Pro.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <article className="md:col-span-5 p-8 rounded-[var(--r-card)] border bg-[var(--paper)] flex flex-col gap-6" style={{ borderColor: "var(--rule)" }}>
                            <div className="flex flex-col gap-1">
                                <span className="text-[var(--t-mono)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">Free</span>
                                <span className="text-[var(--t-display)] font-medium tracking-[var(--ls-display)] text-[var(--ink)]">$0</span>
                            </div>
                            <ul className="flex flex-col gap-3 text-[var(--t-body)] text-[var(--ink)]">
                                {[
                                    "Unlimited resumes",
                                    "All 5 templates",
                                    "DOCX export",
                                    "Web shareable link",
                                ].map((line) => (
                                    <li key={line} className="flex items-start gap-3">
                                        <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--ink-muted)" }} aria-hidden="true" />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup" className="mt-auto">
                                <Button variant="ghost" size="lg" className="w-full">Get started</Button>
                            </Link>
                        </article>

                        <article className="md:col-span-7 p-8 rounded-[var(--r-card)] border bg-[var(--paper)] flex flex-col gap-6" style={{ borderColor: "var(--accent)", boxShadow: "0 0 0 2px var(--accent-soft)" }}>
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[var(--t-mono)] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>Pro</span>
                                    <span className="text-[var(--t-display)] font-medium tracking-[var(--ls-display)] text-[var(--ink)]">$5<span className="text-[var(--t-h3)] text-[var(--ink-muted)] font-normal">/mo</span></span>
                                </div>
                                <span className="text-[var(--t-mono)] uppercase tracking-[0.16em] text-[var(--ink-subtle)] border rounded-[var(--r-button)] px-2 py-1" style={{ borderColor: "var(--rule)" }}>Most useful</span>
                            </div>
                            <ul className="flex flex-col gap-3 text-[var(--t-body)] text-[var(--ink)]">
                                {[
                                    "Everything in Free",
                                    "PDF export with the same render as the preview",
                                    "Saved resume history",
                                    "Email support",
                                ].map((line) => (
                                    <li key={line} className="flex items-start gap-3">
                                        <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} aria-hidden="true" />
                                        {line}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup?plan=pro" className="mt-auto">
                                <Button size="lg" className="w-full">Start with Pro</Button>
                            </Link>
                        </article>
                    </div>
                </div>
            </section>

            {/* ── 4. FOOTER ────────────────────────────── */}
            <footer className="border-t" style={{ borderColor: "var(--rule)", background: "var(--paper)" }}>
                <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4 text-[var(--t-small)] text-[var(--ink-subtle)]">
                    <span>Resume Studio</span>
                    <nav className="flex items-center gap-5" aria-label="Footer">
                        <Link to="/signin" className="hover:text-[var(--ink)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]">Sign in</Link>
                        <Link to="/signup" className="hover:text-[var(--ink)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]">Sign up</Link>
                        <Link to="/create" className="hover:text-[var(--ink)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]">Start</Link>
                    </nav>
                </div>
            </footer>
        </main>
    );
}
