import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1SelectRole from "../components/create-resume/Step1SelectRole";
import Step2Information from "../components/create-resume/Step2Information";
import Step3JobDescription from "../components/create-resume/Step3JobDescription";
import Step4Generate from "../components/create-resume/Step4Generate";
import ManualEntryWizard from "../components/create-resume/ManualEntryWizard";
import "../styles/CreateResume.css";

function CreateResume() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [targetRole, setTargetRole] = useState("");

    // State for Step 2
    const [selectedFile, setSelectedFile] = useState(null);
    const [rawText, setRawText] = useState("");
    const [isManualMode, setIsManualMode] = useState(false);
    const [inputMethod, setInputMethod] = useState(null);

    // State for Step 3
    const [jobDescription, setJobDescription] = useState("");
    const [jobDescriptionImage, setJobDescriptionImage] = useState(null);

    // State for Generation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleNextStep = () => {
        setStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleGenerate = async (manualTextOverride = null) => {
        const textToUse = manualTextOverride || rawText;

        if (!targetRole) {
            setError("Please select a target role.");
            return;
        }

        if (inputMethod === 'upload' && !selectedFile) {
            setError("Please upload a resume file.");
            return;
        }

        if ((inputMethod === 'prompt' || inputMethod === 'manual') && !textToUse.trim()) {
            setError("Please provide your resume information.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            let response;

            let useFormData = (inputMethod === 'upload' && selectedFile) || jobDescriptionImage;

            if (useFormData) {
                const formData = new FormData();
                if (inputMethod === 'upload' && selectedFile) formData.append("resume", selectedFile);
                if (inputMethod !== 'upload' && textToUse.trim()) formData.append("text", textToUse);
                formData.append("targetRole", targetRole);
                if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());
                if (jobDescriptionImage) formData.append("jobDescriptionImage", jobDescriptionImage);

                response = await fetch("http://localhost:5000/api/resumes/extract-resume", {
                    method: "POST",
                    body: formData,
                });
            } else {
                response = await fetch("http://localhost:5000/api/resumes/extract-resume", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: textToUse,
                        targetRole,
                        jobDescription: jobDescription.trim() ? jobDescription.trim() : undefined,
                    }),
                });
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            navigate("/editor", {
                state: {
                    roleResumeData: data.roleResumeData,
                    atsAnalysis: data.atsAnalysis,
                    targetRole,
                    jobDescription: jobDescription.trim() || undefined,
                    prompt: data.prompt || undefined,
                },
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleManualEntry = () => {
        setIsManualMode(true);
        setInputMethod('manual');
        setStep(4);
    };

    const handleManualFinish = (manualData) => {
        const textParts = [];
        const { personalInfo, summary, education, workExperience, skills, certifications, projects } = manualData;
        
        if (personalInfo) {
            textParts.push(`Name: ${personalInfo.firstName} ${personalInfo.lastName}`);
            textParts.push(`Email: ${personalInfo.email}`);
            textParts.push(`Phone: ${personalInfo.phone}`);
            textParts.push(`Location: ${personalInfo.location}`);
            textParts.push(`LinkedIn: ${personalInfo.linkedin}`);
            textParts.push(`GitHub: ${personalInfo.github}`);
        }
        if (summary) textParts.push(`Summary:\n${summary}`);
        if (workExperience?.length) {
            textParts.push("Experience:\n" + workExperience.map(e => `${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate})\n${e.description}`).join("\n\n"));
        }
        if (education?.length) {
            textParts.push("Education:\n" + education.map(e => `${e.degree} at ${e.school}, ${e.graduationDate}`).join("\n"));
        }
        if (skills?.length) {
            textParts.push("Skills:\n" + skills.join(", "));
        }
        if (certifications?.length) {
            textParts.push("Certifications:\n" + certifications.map(c => `${c.name} by ${c.issuer}, ${c.date}`).join("\n"));
        }
        if (projects?.length) {
            textParts.push("Projects:\n" + projects.map(p => `${p.name} (${p.technologies}): ${p.description}\nLink: ${p.link}`).join("\n\n"));
        }

        const generatedText = textParts.join("\n\n");
        setRawText(generatedText);
        setIsManualMode(false); // This switches the view from ManualEntryWizard to Step4Generate
    };

    const handleChangeMethod = () => {
        setIsManualMode(false);
        setInputMethod(null);
        setStep(3);
    };

    return (
        <main className="create-resume-page">
            <div className="create-resume-container">
                <div className="create-resume-header">
                    <h1>Create Your Resume</h1>
                    <p>Build a resume tailored to the role you're targeting.</p>
                </div>

                {/* Progress Bar */}
                <div className="create-resume-progress">
                    <div className="progress-line">
                        <div
                            className="progress-line-fill"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>
                    </div>

                    <div className={`progress-step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`} title="Step 1: Role">
                        <div className="progress-dot"></div>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`} title="Step 2: Job Match">
                        <div className="progress-dot"></div>
                    </div>
                    <div className={`progress-step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`} title="Step 3: Information">
                        <div className="progress-dot"></div>
                    </div>
                    <div className={`progress-step ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`} title="Step 4: Generate">
                        <div className="progress-dot"></div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="create-resume-content">
                    {step === 1 && (
                        <Step1SelectRole
                            selectedRole={targetRole}
                            onSelectRole={setTargetRole}
                            onNext={handleNextStep}
                        />
                    )}
                    {step === 2 && (
                        <Step3JobDescription
                            jobDescription={jobDescription}
                            onJobDescriptionChange={setJobDescription}
                            jobDescriptionImage={jobDescriptionImage}
                            onJobDescriptionImageChange={setJobDescriptionImage}
                            onNext={handleNextStep}
                            onBack={handlePrevStep}
                        />
                    )}
                    {step === 3 && (
                        <Step2Information
                            selectedRole={targetRole}
                            selectedFile={selectedFile}
                            onFileSelect={setSelectedFile}
                            rawText={rawText}
                            onTextChange={setRawText}
                            initialMode={inputMethod === 'manual' ? null : inputMethod}
                            onNext={(selectedMode) => {
                                setIsManualMode(false);
                                setInputMethod(selectedMode);
                                handleNextStep();
                            }}
                            onBack={handlePrevStep}
                            onManualEntry={handleManualEntry}
                        />
                    )}
                    {step === 4 && (
                        isManualMode ? (
                            <ManualEntryWizard 
                                targetRole={targetRole}
                                onBack={handlePrevStep}
                                onFinish={handleManualFinish}
                                onChangeMethod={handleChangeMethod}
                            />
                        ) : (
                            <Step4Generate
                                selectedRole={targetRole}
                                hasResumeInfo={!!selectedFile || !!rawText.trim()}
                                hasJobDescription={!!jobDescription.trim() || !!jobDescriptionImage}
                                onGenerate={() => handleGenerate()}
                                onBack={handlePrevStep}
                                loading={loading}
                                error={error}
                            />
                        )
                    )}
                </div>
            </div>
        </main>
    );
}

export default CreateResume;