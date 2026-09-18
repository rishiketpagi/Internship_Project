/*
 * Onboarding — 4 steps to the editor:
 *   1. Choose   — start blank or upload existing
 *   2. Extract  — upload PDF/DOCX or paste text
 *   3. Role     — pick a target role
 *   4. Editor   — prefill + redirect
 *
 * Single page, internal step state. Crossfade between steps via CSS.
 * No emoji, no "01 / 02 / 03" eyebrows, no AI-y copy.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field, Pill, useToast } from "../components/ui";
import ResumeFileUpload from "../components/input/FileUpload";
import ResumeTextInput from "../components/input/TextInput";
import { roles } from "../data/roles";
import { apiUrl } from "../config/api";
import { sampleResumeData } from "../data/sampleResumeData";

const STEPS = [
    { key: "choose", label: "Choose" },
    { key: "extract", label: "Source" },
    { key: "role", label: "Role" },
    { key: "ready", label: "Ready" },
];

export default function Onboarding() {
    const navigate = useNavigate();
    const toast = useToast();
    const [stepIndex, setStepIndex] = useState(0);
    const [direction, setDirection] = useState("forward"); // forward | back
    const [mode, setMode] = useState(null); // 'blank' | 'file' | 'text'
    const [file, setFile] = useState(null);
    const [rawText, setRawText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [targetRole, setTargetRole] = useState(roles[0] || "");
    const [extractedData, setExtractedData] = useState(null);
    const [extracting, setExtracting] = useState(false);
    const [error, setError] = useState("");

    const step = STEPS[stepIndex].key;
    const progress = ((stepIndex + 1) / STEPS.length) * 100;

    const goNext = () => {
        setDirection("forward");
        setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    };
    const goBack = () => {
        setDirection("back");
        setStepIndex((i) => Math.max(i - 1, 0));
    };

    const handleExtract = async () => {
        if (!file && !rawText.trim()) {
            setError("Provide a file or paste some resume text to extract from.");
            return;
        }
        setError("");
        setExtracting(true);

        try {
            let response;
            if (file) {
                const formData = new FormData();
                formData.append("resume", file);
                formData.append("targetRole", targetRole);
                if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());
                response = await fetch(apiUrl("/extract-resume"), { method: "POST", body: formData });
            } else {
                response = await fetch(apiUrl("/extract-resume"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: rawText,
                        targetRole,
                        jobDescription: jobDescription.trim() ? jobDescription.trim() : undefined,
                    }),
                });
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Extraction failed");
            setExtractedData(data.roleResumeData || data);
            goNext();
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setExtracting(false);
        }
    };

    const handleEnterEditor = () => {
        let resumeData;
        let prefillRole = targetRole;
        if (mode === "blank") {
            resumeData = sampleResumeData;
        } else if (extractedData?.candidateProfile) {
            resumeData = extractedData.candidateProfile;
            prefillRole = extractedData.targetRole || targetRole;
        } else if (extractedData) {
            resumeData = extractedData;
        } else {
            resumeData = sampleResumeData;
        }

        navigate("/editor-v2", {
            state: { resumeData, targetRole: prefillRole, roleResumeData: extractedData },
        });
    };

    return (
        <main className="page-bg min-h-[100dvh] flex flex-col">
            <header className="border-b shrink-0" style={{ borderColor: "var(--rule)" }}>
                <div className="max-w-[var(--max-w-content)] mx-auto px-5 h-[var(--topbar-h)] flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-[var(--ink)]"
                    >
                        <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--ink-inverse)] text-[var(--t-mono)] font-semibold"
                            style={{ background: "var(--accent)" }}
                            aria-hidden="true"
                        >
                            R
                        </span>
                        <span className="text-[var(--t-body)] font-medium">Resume Studio</span>
                    </button>
                    <span className="ml-auto text-[var(--t-mono)] text-[var(--ink-subtle)]">
                        Step {stepIndex + 1} of {STEPS.length}
                    </span>
                </div>
                <div className="h-px w-full" style={{ background: "var(--rule)" }}>
                    <div
                        className="h-px transition-[width] duration-[var(--d-hover)] ease-[var(--ease-out)]"
                        style={{ width: `${progress}%`, background: "var(--accent)" }}
                    />
                </div>
            </header>

            <div className="flex-1 flex items-start justify-center px-5 py-12">
                <div className="w-full max-w-[640px]" key={step}>
                    <div
                        className="animate-[step-in_var(--d-reveal)_var(--ease-out)_1]"
                    >
                        {step === "choose" && (
                            <ChooseStep
                                mode={mode}
                                onSelect={(m) => { setMode(m); setError(""); }}
                                onContinue={() => {
                                    if (mode === "blank") {
                                        setExtractedData(null);
                                        setStepIndex(2); // skip extract, go to role
                                    } else {
                                        goNext();
                                    }
                                }}
                                error={error}
                            />
                        )}
                        {step === "extract" && (
                            <ExtractStep
                                file={file}
                                onFileChange={setFile}
                                rawText={rawText}
                                onRawTextChange={setRawText}
                                jobDescription={jobDescription}
                                onJobDescriptionChange={setJobDescription}
                                extracting={extracting}
                                onExtract={handleExtract}
                                error={error}
                            />
                        )}
                        {step === "role" && (
                            <RoleStep
                                roles={roles}
                                targetRole={targetRole}
                                onChange={setTargetRole}
                                onContinue={() => setStepIndex(3)}
                            />
                        )}
                        {step === "ready" && (
                            <ReadyStep
                                mode={mode}
                                targetRole={targetRole}
                                extractedName={extractedData?.candidateProfile?.personalInfo?.name}
                                onEnter={handleEnterEditor}
                            />
                        )}
                    </div>
                </div>
            </div>

            <nav
                className="border-t shrink-0"
                style={{ borderColor: "var(--rule)" }}
                aria-label="Onboarding navigation"
            >
                <div className="max-w-[var(--max-w-content)] mx-auto px-5 h-[72px] flex items-center justify-between gap-3">
                    <Button variant="quiet" onClick={goBack} disabled={stepIndex === 0}>
                        Back
                    </Button>
                    <span className="text-[var(--t-mono)] text-[var(--ink-subtle)] hidden sm:inline">
                        {STEPS[stepIndex].label}
                    </span>
                    <div className="flex items-center gap-2">
                        {step === "choose" && (
                            <Button onClick={() => {
                                if (!mode) { setError("Pick one option to continue."); return; }
                                if (mode === "blank") {
                                    setExtractedData(null);
                                    setStepIndex(2);
                                } else {
                                    goNext();
                                }
                            }}>
                                Continue
                            </Button>
                        )}
                        {step === "extract" && (
                            <Button onClick={handleExtract} loading={extracting}>
                                {extracting ? "Extracting" : "Extract"}
                            </Button>
                        )}
                        {step === "role" && (
                            <Button onClick={() => setStepIndex(3)} disabled={!targetRole}>
                                Continue
                            </Button>
                        )}
                        {step === "ready" && (
                            <Button onClick={handleEnterEditor}>
                                Open editor
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            <style>{`
                @keyframes step-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}

/* ── Step 1: Choose ───────────────────────────────── */
function ChooseStep({ mode, onSelect, error }) {
    const options = [
        { key: "blank", title: "Start blank", desc: "Build a resume from scratch with a guided editor." },
        { key: "upload", title: "Upload a PDF or DOCX", desc: "We'll extract your content and put it in the right places." },
        { key: "text", title: "Paste resume text", desc: "Drop in any text version of your resume for the same treatment." },
    ];

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                    How do you want to start?
                </h1>
                <p className="text-[var(--t-body)] text-[var(--ink-muted)] max-w-[55ch]">
                    Pick the path that fits where you are. You can switch later.
                </p>
            </header>

            <ul className="flex flex-col gap-3" role="radiogroup" aria-label="How to start">
                {options.map((opt) => {
                    const selected = mode === opt.key;
                    return (
                        <li key={opt.key}>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => onSelect(opt.key)}
                                className={[
                                    "w-full text-left p-5 rounded-[var(--r-card)] border bg-[var(--paper)]",
                                    "transition-[border-color,background-color,transform] duration-[var(--d-press)] ease-[var(--ease-out)]",
                                    "active:scale-[0.99]",
                                    selected
                                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                                        : "border-[var(--rule)] hover:border-[var(--ink-subtle)]",
                                ].join(" ")}
                                style={selected ? { boxShadow: "0 0 0 2px var(--accent-soft)" } : {}}
                            >
                                <div className="flex items-start gap-4">
                                    <span
                                        className="mt-1 inline-block w-4 h-4 rounded-full border-2 shrink-0"
                                        style={{
                                            borderColor: selected ? "var(--accent)" : "var(--rule-strong)",
                                            background: selected ? "var(--accent)" : "transparent",
                                        }}
                                        aria-hidden="true"
                                    />
                                    <div className="flex-1">
                                        <div className="text-[var(--t-body)] font-medium text-[var(--ink)]">
                                            {opt.title}
                                        </div>
                                        <div className="text-[var(--t-small)] text-[var(--ink-muted)] mt-1">
                                            {opt.desc}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {error && (
                <p role="alert" className="text-[var(--t-small)] text-[var(--warn)]">
                    {error}
                </p>
            )}
        </div>
    );
}

/* ── Step 2: Extract ──────────────────────────────── */
function ExtractStep({ file, onFileChange, rawText, onRawTextChange, jobDescription, onJobDescriptionChange, extracting, onExtract, error }) {
    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                    Bring your existing resume
                </h1>
                <p className="text-[var(--t-body)] text-[var(--ink-muted)] max-w-[55ch]">
                    Upload a file or paste the text. We'll structure it for you.
                </p>
            </header>

            <div className="flex flex-col gap-6">
                <Field label="Upload file" helper="PDF or DOCX. Max 10MB.">
                    <ResumeFileUpload file={file} onFileChange={onFileChange} />
                </Field>

                <div className="flex items-center gap-3 text-[var(--t-mono)] uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
                    <span className="flex-1 h-px" style={{ background: "var(--rule)" }} />
                    <span>or</span>
                    <span className="flex-1 h-px" style={{ background: "var(--rule)" }} />
                </div>

                <Field label="Paste resume text" helper="Anything you have. We'll clean it up.">
                    <ResumeTextInput value={rawText} onChange={onRawTextChange} />
                </Field>

                <Field label="Job description" helper="Optional. Helps tailor the result." optional>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => onJobDescriptionChange(e.target.value)}
                        placeholder="Paste the role description here..."
                        rows={4}
                        className="w-full bg-[var(--paper)] text-[var(--ink)] placeholder:text-[var(--ink-subtle)] border-0 border-b border-[var(--rule)] rounded-none px-0 py-2 transition-[border-color] duration-[var(--d-hover)] ease-[var(--ease-out)] hover:border-[var(--ink-subtle)] focus:border-[var(--accent)] focus:outline-none text-[var(--t-body)] resize-y"
                    />
                </Field>
            </div>

            {error && (
                <p role="alert" className="text-[var(--t-small)] text-[var(--warn)]">
                    {error}
                </p>
            )}
            {extracting && (
                <p className="text-[var(--t-small)] text-[var(--ink-muted)]">Extracting and structuring your resume...</p>
            )}
        </div>
    );
}

/* ── Step 3: Role ─────────────────────────────────── */
function RoleStep({ roles, targetRole, onChange }) {
    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                    What role are you targeting?
                </h1>
                <p className="text-[var(--t-body)] text-[var(--ink-muted)] max-w-[55ch]">
                    We use this to suggest the right sections and language.
                </p>
            </header>

            <Field label="Target role">
                <select
                    value={targetRole}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[var(--paper)] text-[var(--ink)] border-0 border-b border-[var(--rule)] rounded-none px-0 py-2 transition-[border-color] duration-[var(--d-hover)] ease-[var(--ease-out)] hover:border-[var(--ink-subtle)] focus:border-[var(--accent)] focus:outline-none text-[var(--t-body)]"
                >
                    {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </Field>
        </div>
    );
}

/* ── Step 4: Ready ────────────────────────────────── */
function ReadyStep({ mode, targetRole, extractedName, onEnter }) {
    return (
        <div className="flex flex-col gap-6 text-center">
            <header className="flex flex-col gap-3 items-center">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "var(--accent-soft)" }}
                    aria-hidden="true"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10.5l3.5 3.5L16 5" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h1 className="text-[var(--t-h1)] font-medium tracking-[var(--ls-heading)] text-[var(--ink)]">
                    You're ready
                </h1>
                <p className="text-[var(--t-body)] text-[var(--ink-muted)] max-w-[50ch]">
                    {mode === "blank"
                        ? "Start with a clean slate. The editor will guide you through each section."
                        : `We've extracted ${extractedName ? extractedName + "'s" : "your"} resume. Edit and polish it in the document workspace.`}
                </p>
            </header>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <Pill variant="neutral">Target role: {targetRole || "Not set"}</Pill>
                <Pill variant={mode === "blank" ? "warn" : "ok"}>
                    {mode === "blank" ? "Starting blank" : mode === "upload" ? "From file" : "From text"}
                </Pill>
            </div>

            <div className="flex justify-center pt-2">
                <Button size="lg" onClick={onEnter}>
                    Open the editor
                </Button>
            </div>
        </div>
    );
}
