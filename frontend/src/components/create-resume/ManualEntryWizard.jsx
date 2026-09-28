import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManualEntryWizard({ targetRole, onBack, onFinish, onChangeMethod }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    
    const [resumeData, setResumeData] = useState({
        personalInfo: { firstName: "", lastName: "", email: "", phone: "", location: "", linkedin: "", github: "" },
        summary: "",
        education: [],
        workExperience: [],
        skills: [],
        certifications: [],
        projects: []
    });

    const [skillInput, setSkillInput] = useState("");
    
    // GitHub Projects state
    const [githubUrl, setGithubUrl] = useState("");
    const [fetchingProject, setFetchingProject] = useState(false);
    const [projectFound, setProjectFound] = useState(null);

    const handleNext = () => {
        if (currentStep < 7) setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else onBack();
    };

    const handleFinish = () => {
        onFinish(resumeData);
    };

    const [detectedSkills, setDetectedSkills] = useState([]);
    const [addedSkills, setAddedSkills] = useState([]);

    const handleFetchGithub = async () => {
        if (!githubUrl) return;
        setFetchingProject(true);
        setDetectedSkills([]);
        setAddedSkills([]);

        try {
            const res = await fetch("http://localhost:5000/api/resumes/analyze-github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubUrl }),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                const fetchedTech = data.project.technologies || [];
                setProjectFound({
                    name: data.project.name,
                    description: data.project.description || "",
                    technologies: Array.isArray(fetchedTech) 
                        ? fetchedTech.join(", ") 
                        : fetchedTech || "",
                    link: data.project.url
                });

                // Extract skills array correctly
                const techArray = Array.isArray(fetchedTech) ? fetchedTech : (typeof fetchedTech === 'string' ? fetchedTech.split(',').map(s=>s.trim()) : []);
                
                // Identify new skills
                const currentSkillNames = resumeData.skills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase() || "");
                const newSkills = techArray.filter(tech => tech && !currentSkillNames.includes(tech.toLowerCase()));
                if (newSkills.length > 0) {
                    setDetectedSkills(newSkills);
                }
            } else {
                alert(data.message || "Repository not found or invalid.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to analyze project with AI. Please try again.");
        } finally {
            setFetchingProject(false);
        }
    };

    const handleAddSkillFromGithub = (skill) => {
        setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        setAddedSkills([...addedSkills, skill]);
        setTimeout(() => {
            setDetectedSkills(prev => prev.filter(s => s !== skill));
            setAddedSkills(prev => prev.filter(s => s !== skill));
        }, 2000);
    };

    const handleDismissSkillFromGithub = (skill) => {
        setDetectedSkills(prev => prev.filter(s => s !== skill));
    };

    const addFoundProject = () => {
        if (projectFound) {
            setResumeData(prev => ({ ...prev, projects: [...prev.projects, projectFound] }));
            setProjectFound(null);
            setGithubUrl("");
        }
    };

    const addEducation = () => setResumeData(p => ({ ...p, education: [...p.education, { degree: "", school: "", graduationDate: "" }] }));
    const updateEducation = (idx, field, value) => setResumeData(p => {
        const newEdu = [...p.education];
        newEdu[idx][field] = value;
        return { ...p, education: newEdu };
    });
    const removeEducation = (idx) => setResumeData(p => ({ ...p, education: p.education.filter((_, i) => i !== idx) }));

    const addExperience = () => setResumeData(p => ({ ...p, workExperience: [...p.workExperience, { jobTitle: "", company: "", startDate: "", endDate: "", description: "" }] }));
    const updateExperience = (idx, field, value) => setResumeData(p => {
        const newExp = [...p.workExperience];
        newExp[idx][field] = value;
        return { ...p, workExperience: newExp };
    });
    const removeExperience = (idx) => setResumeData(p => ({ ...p, workExperience: p.workExperience.filter((_, i) => i !== idx) }));

    const addSkill = () => {
        if (skillInput.trim()) {
            setResumeData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
            setSkillInput("");
        }
    };
    const removeSkill = (idx) => setResumeData(p => ({ ...p, skills: p.skills.filter((_, i) => i !== idx) }));

    const addCertification = () => setResumeData(p => ({ ...p, certifications: [...p.certifications, { name: "", issuer: "", date: "" }] }));
    const updateCertification = (idx, field, value) => setResumeData(p => {
        const newCert = [...p.certifications];
        newCert[idx][field] = value;
        return { ...p, certifications: newCert };
    });
    const removeCertification = (idx) => setResumeData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }));

    const addManualProjectBlock = () => setResumeData(p => ({ ...p, projects: [...p.projects, { name: "", description: "", technologies: "", link: "" }] }));
    const updateProject = (idx, field, value) => setResumeData(p => {
        const newProj = [...p.projects];
        newProj[idx][field] = value;
        return { ...p, projects: newProj };
    });
    const removeProject = (idx) => setResumeData(p => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }));

    const updatePersonalInfo = (field, value) => {
        setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));
    };

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-8 flex-grow">
            {/* Navigation Header */}
            <div className="mb-6 w-full max-w-4xl mx-auto flex-shrink-0">
                <div className="flex items-center mb-6">
                    <button onClick={onChangeMethod} className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Change input method
                    </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-3 gap-x-2 w-full justify-between border-b border-slate-100 pb-2">
                    {[
                        { id: 1, label: "Personal Info" },
                        { id: 2, label: "Summary" },
                        { id: 3, label: "Education" },
                        { id: 4, label: "Experience" },
                        { id: 5, label: "Skills" },
                        { id: 6, label: "Certifications" },
                        { id: 7, label: "Projects" },
                    ].map((step) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`flex items-center gap-1.5 py-1 text-xs font-bold transition-all ${
                                currentStep === step.id
                                    ? "text-slate-900"
                                    : currentStep > step.id 
                                        ? "text-emerald-600"
                                        : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {currentStep > step.id ? (
                                <span className="flex items-center justify-center font-bold">✓</span>
                            ) : currentStep === step.id ? (
                                <span className="flex items-center justify-center font-bold text-[10px]">●</span>
                            ) : (
                                <span className="flex items-center justify-center font-bold text-[10px]">○</span>
                            )}
                            <span className={currentStep === step.id ? "underline decoration-2 underline-offset-4" : ""}>{step.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto px-1 mx-auto w-full max-w-3xl custom-scrollbar pb-6">
                <div className="mb-8">
                    <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">
                        Step {currentStep} of 7
                    </h2>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">
                        {currentStep === 1 && "Personal Information"}
                        {currentStep === 2 && "Professional Summary"}
                        {currentStep === 3 && "Education"}
                        {currentStep === 4 && "Experience"}
                        {currentStep === 5 && "Skills"}
                        {currentStep === 6 && "Certifications"}
                        {currentStep === 7 && "Projects"}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        {currentStep === 1 && "Let's start with your basic contact details."}
                        {currentStep === 2 && "A brief overview of your professional background and goals."}
                        {currentStep === 3 && "List your relevant academic degrees and institutions."}
                        {currentStep === 4 && "Highlight your most relevant past work experience."}
                        {currentStep === 5 && "Add key skills relevant to the roles you are targeting."}
                        {currentStep === 6 && "Include any relevant certifications or licenses."}
                        {currentStep === 7 && "Showcase your past projects to demonstrate your abilities."}
                    </p>
                </div>
                
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">First Name <span className="text-red-500">*</span></label>
                                <input type="text" value={resumeData.personalInfo.firstName} onChange={e => updatePersonalInfo('firstName', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Last Name <span className="text-red-500">*</span></label>
                                <input type="text" value={resumeData.personalInfo.lastName} onChange={e => updatePersonalInfo('lastName', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email <span className="text-red-500">*</span></label>
                            <input type="email" value={resumeData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="john@example.com" />
                        </div>
                        
                        <div className="border-t border-slate-100 my-2"></div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone <span className="font-normal text-slate-400 normal-case">(Optional)</span></label>
                            <input type="tel" value={resumeData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location <span className="font-normal text-slate-400 normal-case">(Optional)</span></label>
                            <input type="text" value={resumeData.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="New York, NY" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">LinkedIn URL <span className="font-normal text-slate-400 normal-case">(Optional)</span></label>
                            <input type="url" value={resumeData.personalInfo.linkedin} onChange={e => updatePersonalInfo('linkedin', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="linkedin.com/in/johndoe" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GitHub URL <span className="font-normal text-slate-400 normal-case">(Optional)</span></label>
                            <input type="url" value={resumeData.personalInfo.github} onChange={e => updatePersonalInfo('github', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" placeholder="github.com/johndoe" />
                        </div>
                    </div>
                )}

                {/* Step 2: Summary */}
                {currentStep === 2 && (
                    <div className="flex-grow flex flex-col h-full">
                        <textarea 
                            value={resumeData.summary} 
                            onChange={e => setResumeData(p => ({...p, summary: e.target.value}))} 
                            className="w-full flex-grow min-h-[300px] p-5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-xl resize-none transition-colors"
                            placeholder="Example: I'm a software engineer with 5 years of experience in React and Node.js..."
                        ></textarea>
                    </div>
                )}

                {/* Step 3: Education */}
                {currentStep === 3 && (
                    <div className="flex flex-col gap-4">
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="p-5 border border-slate-200 rounded-xl flex flex-col gap-4 relative bg-slate-50/50">
                                <button onClick={() => removeEducation(idx)} className="absolute top-5 right-5 text-red-500 text-sm font-bold hover:underline">Remove</button>
                                <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Education {idx + 1}</h4>
                                <input type="text" placeholder="Degree / Program" value={edu.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <input type="text" placeholder="School / University" value={edu.school} onChange={e => updateEducation(idx, 'school', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <input type="text" placeholder="Graduation Date" value={edu.graduationDate} onChange={e => updateEducation(idx, 'graduationDate', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                            </div>
                        ))}
                        <button onClick={addEducation} className="bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-bold text-sm transition-all">+ Add Education</button>
                    </div>
                )}

                {/* Step 4: Experience */}
                {currentStep === 4 && (
                    <div className="flex flex-col gap-4">
                        {resumeData.workExperience.map((exp, idx) => (
                            <div key={idx} className="p-5 border border-slate-200 rounded-xl flex flex-col gap-4 relative bg-slate-50/50">
                                <button onClick={() => removeExperience(idx)} className="absolute top-5 right-5 text-red-500 text-sm font-bold hover:underline">Remove</button>
                                <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Experience {idx + 1}</h4>
                                <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={e => updateExperience(idx, 'jobTitle', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <input type="text" placeholder="Company" value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Start Date" value={exp.startDate} onChange={e => updateExperience(idx, 'startDate', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                    <input type="text" placeholder="End Date" value={exp.endDate} onChange={e => updateExperience(idx, 'endDate', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                </div>
                                <textarea placeholder="Description" value={exp.description} onChange={e => updateExperience(idx, 'description', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg resize-none transition-colors" rows="3"></textarea>
                            </div>
                        ))}
                        <button onClick={addExperience} className="bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-bold text-sm transition-all">+ Add Experience</button>
                    </div>
                )}

                {/* Step 5: Skills */}
                {currentStep === 5 && (
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-2">
                            <input type="text" placeholder="E.g. JavaScript, React, Project Management..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} className="flex-grow p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                            <button onClick={addSkill} className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-lg font-bold transition-colors">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill, idx) => (
                                <div key={idx} className="bg-slate-100 text-slate-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-slate-200">
                                    {skill}
                                    <button onClick={() => removeSkill(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                            ))}
                            {resumeData.skills.length === 0 && (
                                <p className="text-sm text-slate-400 italic p-2">No skills added yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 6: Certifications */}
                {currentStep === 6 && (
                    <div className="flex flex-col gap-4">
                        {resumeData.certifications.map((cert, idx) => (
                            <div key={idx} className="p-5 border border-slate-200 rounded-xl flex flex-col gap-4 relative bg-slate-50/50">
                                <button onClick={() => removeCertification(idx)} className="absolute top-5 right-5 text-red-500 text-sm font-bold hover:underline">Remove</button>
                                <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Certification {idx + 1}</h4>
                                <input type="text" placeholder="Certification Name" value={cert.name} onChange={e => updateCertification(idx, 'name', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <input type="text" placeholder="Issuer (e.g. AWS, Coursera)" value={cert.issuer} onChange={e => updateCertification(idx, 'issuer', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <input type="text" placeholder="Date" value={cert.date} onChange={e => updateCertification(idx, 'date', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                            </div>
                        ))}
                        <button onClick={addCertification} className="bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-bold text-sm transition-all">+ Add Certification</button>
                    </div>
                )}

                {/* Step 7: Projects */}
                {currentStep === 7 && (
                    <div className="flex flex-col gap-4">
                        {resumeData.projects.map((proj, idx) => (
                            <div key={idx} className="p-5 border border-slate-200 rounded-xl flex flex-col gap-4 relative bg-slate-50/50">
                                <button onClick={() => removeProject(idx)} className="absolute top-5 right-5 text-red-500 text-sm font-bold hover:underline">Remove</button>
                                <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Project {idx + 1}</h4>
                                <input type="text" placeholder="Project Name" value={proj.name} onChange={e => updateProject(idx, 'name', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <textarea placeholder="Description" value={proj.description} onChange={e => updateProject(idx, 'description', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg resize-none transition-colors" rows="3"></textarea>
                                <input type="text" placeholder="Technologies (e.g. React, Node.js)" value={proj.technologies} onChange={e => updateProject(idx, 'technologies', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                                <input type="url" placeholder="Project Link" value={proj.link} onChange={e => updateProject(idx, 'link', e.target.value)} className="w-full p-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg transition-colors" />
                            </div>
                        ))}

                        <div className="p-6 border-2 border-slate-200 rounded-xl text-center flex flex-col items-center bg-white shadow-sm mt-2">
                            <h4 className="font-bold text-lg mb-2">Have projects on GitHub?</h4>
                            <p className="text-slate-500 text-sm mb-4">Paste your repository URL and we'll fetch the details for you.</p>
                            <div className="flex w-full gap-2 mb-4">
                                <input 
                                    type="url" 
                                    placeholder="github.com/username/repo" 
                                    value={githubUrl}
                                    onChange={e => setGithubUrl(e.target.value)}
                                    className="flex-grow p-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg text-sm transition-colors"
                                />
                                <button 
                                    onClick={handleFetchGithub}
                                    disabled={fetchingProject}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors"
                                >
                                    {fetchingProject ? "Fetching..." : "Fetch Project"}
                                </button>
                            </div>
                            <div className="flex items-center w-full mb-4">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="px-3 text-xs text-slate-400 font-bold uppercase">OR</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>
                            <button onClick={addManualProjectBlock} className="text-blue-600 font-bold text-sm hover:underline">
                                + Add Project Manually
                            </button>
                        </div>

                        {projectFound && (
                            <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded-xl flex flex-col mt-4">
                                <h4 className="font-bold text-blue-600 text-sm tracking-wider uppercase mb-3">Project Found</h4>
                                <h5 className="font-extrabold text-xl mb-1">{projectFound.name}</h5>
                                <p className="text-slate-700 text-sm mb-3">{projectFound.description}</p>
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Technologies:</p>
                                    <p className="text-sm font-semibold">{projectFound.technologies || "N/A"}</p>
                                </div>
                                {detectedSkills.length > 0 && (
                                    <div className="mt-2 mb-4 p-4 bg-white rounded-lg border border-blue-200">
                                        <p className="text-xs font-bold text-slate-600 mb-2">New Skills Detected (Click + to add to your skills)</p>
                                        <div className="flex flex-wrap gap-2">
                                            {detectedSkills.map(skill => {
                                                const isAdded = addedSkills.includes(skill);
                                                return (
                                                    <div key={skill} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors ${isAdded ? 'bg-green-500 text-white border border-green-500' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                                                        <span className="font-semibold">{skill}</span>
                                                        {!isAdded && (
                                                            <>
                                                                <button onClick={() => handleAddSkillFromGithub(skill)} className="text-blue-500 font-bold hover:text-blue-700 w-4 h-4 flex items-center justify-center">+</button>
                                                                <button onClick={() => handleDismissSkillFromGithub(skill)} className="text-red-400 font-bold hover:text-red-600 w-4 h-4 flex items-center justify-center">×</button>
                                                            </>
                                                        )}
                                                        {isAdded && <span className="font-bold pl-1">✓</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setProjectFound(null)} className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 rounded-lg font-bold text-sm transition-colors">Cancel</button>
                                    <button onClick={addFoundProject} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold text-sm transition-colors">Add Project</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-100 pt-6 mt-2 max-w-4xl mx-auto w-full">
                <button
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Back
                </button>
                <button
                    onClick={currentStep < 7 ? handleNext : handleFinish}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
                >
                    Save & Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
