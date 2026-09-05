import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import ModernTemplate from "../components/templates/ModernTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import "../styles/ResumeEditor.css";

const sampleResumeData = {
    personalInfo: {
        name: "Rishiket Pagi",
        email: "rishiket@example.com",
        phone: "+91 9876543210",
        location: "Goa, India",
        linkedin: "linkedin.com/in/rishiketpagi",
        github: "github.com/rishiketpagi",
        portfolio: "",
    },

    professionalSummary:
        "Final year Computer Engineering student interested in backend and full-stack development.",

    education: [
        {
            institution: "Goa College of Engineering",
            degree: "Bachelor of Engineering",
            field: "Computer Engineering",
            startDate: "2022",
            endDate: "2026",
            grade: "",
        },
    ],

    workExperience: [
        {
            jobTitle: "Software Development Intern",
            company: "ABC Technologies",
            location: "Goa, India",
            startDate: "June 2026",
            endDate: "August 2026",
            description:
                "Worked on React applications and implemented REST API integrations.",
            responsibilities: [],
        },
    ],

    projects: [
        {
            name: "Resume Generator",
            description:
                "Built a web application that allows users to create job-specific resumes.",
            technologies: ["React", "Firebase", "Node.js"],
            url: "",
            startDate: "",
            endDate: "",
        },
    ],

    skills: [
        "JavaScript",
        "React",
        "Node.js",
        "Express.js",
        "Firebase",
        "Git",
    ],

    certifications: [],
    achievements: [],
};

const templateComponents = {
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    minimal: MinimalTemplate,
};

const emptyEducation = {
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    grade: "",
};

const emptyWorkExperience = {
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    responsibilities: [],
};

const emptyProject = {
    name: "",
    description: "",
    technologies: [],
    url: "",
    startDate: "",
    endDate: "",
};





export default function ResumeEditor() {
    const [searchParams] = useSearchParams();

    const templateId = searchParams.get("template") || "modern";

    const TemplateComponent =
        templateComponents[templateId] || ModernTemplate;

    const [resumeData, setResumeData] = useState(sampleResumeData);
    const [newSkill, setNewSkill] = useState("");
    const [previewScale, setPreviewScale] = useState(0.55);

    const handlePreviewWheel = (event) => {
        if (!event.ctrlKey) {
            return;
        }

        event.preventDefault();
        setPreviewScale((currentScale) =>
            Math.min(
                1.2,
                Math.max(0.35, currentScale + (event.deltaY < 0 ? 0.05 : -0.05))
            )
        );
    };

    return (
        <main className="resume-editor-page">
            <header className="resume-editor-header">
                <h1 className="resume-editor-title">
                    Resume Editor
                </h1>

                <div className="resume-editor-actions">
                    <button className="resume-editor-save-button">
                        Save
                    </button>

                    <button className="resume-editor-download-button">
                        Download PDF
                    </button>
                </div>
            </header>

            <div className="resume-editor-layout">
                {/* EDITOR */}
                <section className="resume-editor-form-panel">
                    <h2 className="resume-editor-heading">
                        Edit Resume
                    </h2>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">
                            Personal Information
                        </h3>

                        <div className="resume-editor-fields">
                            {[
                                ["name", "Name", "text"],
                                ["email", "Email", "email"],
                                ["phone", "Phone", "tel"],
                                ["location", "Location", "text"],
                                ["linkedin", "LinkedIn", "url"],
                                ["github", "GitHub", "url"],
                                ["portfolio", "Portfolio", "url"],
                            ].map(([field, label, type]) => (
                                <label key={field} className="resume-editor-field">
                                    <span className="resume-editor-label">
                                        {label}
                                    </span>
                                    <input
                                        type={type}
                                        value={resumeData.personalInfo[field]}
                                        onChange={(event) =>
                                            setResumeData((currentResume) => ({
                                                ...currentResume,
                                                personalInfo: {
                                                    ...currentResume.personalInfo,
                                                    [field]: event.target.value,
                                                },
                                            }))
                                        }
                                        className="resume-editor-input"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">
                            Professional Summary
                        </h3>

                        <textarea
                            value={resumeData.professionalSummary}
                            onChange={(event) =>
                                setResumeData((currentResume) => ({
                                    ...currentResume,
                                    professionalSummary: event.target.value,
                                }))
                            }
                            className="resume-editor-textarea resume-editor-summary"
                            rows={5}
                        />
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">
                            Education
                        </h3>

                        <div className="resume-editor-education-list">
                            {resumeData.education.map((education, educationIndex) => (
                                <div
                                    key={educationIndex}
                                    className="resume-editor-education-card"
                                >
                                    <div className="resume-editor-fields">
                                        {[
                                            ["institution", "Institution"],
                                            ["degree", "Degree"],
                                            ["field", "Field of Study"],
                                            ["startDate", "Start Date"],
                                            ["endDate", "End Date"],
                                            ["grade", "Grade"],
                                        ].map(([field, label]) => (
                                            <label key={field} className="resume-editor-field">
                                                <span className="resume-editor-label">
                                                    {label}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={education[field]}
                                                    onChange={(event) =>
                                                        setResumeData((currentResume) => ({
                                                            ...currentResume,
                                                            education: currentResume.education.map(
                                                                (entry, index) =>
                                                                    index === educationIndex
                                                                        ? {
                                                                            ...entry,
                                                                            [field]: event.target.value,
                                                                        }
                                                                        : entry
                                                            ),
                                                        }))
                                                    }
                                                    className="resume-editor-input"
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setResumeData((currentResume) => ({
                                                ...currentResume,
                                                education: currentResume.education.filter(
                                                    (_, index) => index !== educationIndex
                                                ),
                                            }))
                                        }
                                        className="resume-editor-delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    setResumeData((currentResume) => ({
                                        ...currentResume,
                                        education: [
                                            ...currentResume.education,
                                            { ...emptyEducation },
                                        ],
                                    }))
                                }
                                className="resume-editor-add-button"
                            >
                                + Add Education
                            </button>
                        </div>
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">
                            Work Experience
                        </h3>

                        <div className="resume-editor-education-list">
                            {resumeData.workExperience.map((experience, experienceIndex) => (
                                <div
                                    key={experienceIndex}
                                    className="resume-editor-education-card"
                                >
                                    <div className="resume-editor-fields">
                                        {[
                                            ["jobTitle", "Job Title"],
                                            ["company", "Company"],
                                            ["location", "Location"],
                                            ["startDate", "Start Date"],
                                            ["endDate", "End Date"],
                                        ].map(([field, label]) => (
                                            <label key={field} className="resume-editor-field">
                                                <span className="resume-editor-label">
                                                    {label}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={experience[field]}
                                                    onChange={(event) =>
                                                        setResumeData((currentResume) => ({
                                                            ...currentResume,
                                                            workExperience: currentResume.workExperience.map(
                                                                (entry, index) =>
                                                                    index === experienceIndex
                                                                        ? {
                                                                            ...entry,
                                                                            [field]: event.target.value,
                                                                        }
                                                                        : entry
                                                            ),
                                                        }))
                                                    }
                                                    className="resume-editor-input"
                                                />
                                            </label>
                                        ))}

                                        <label className="resume-editor-field">
                                            <span className="resume-editor-label">
                                                Description
                                            </span>
                                            <textarea
                                                value={experience.description}
                                                onChange={(event) =>
                                                    setResumeData((currentResume) => ({
                                                        ...currentResume,
                                                        workExperience: currentResume.workExperience.map(
                                                            (entry, index) =>
                                                                index === experienceIndex
                                                                    ? {
                                                                        ...entry,
                                                                        description: event.target.value,
                                                                    }
                                                                    : entry
                                                        ),
                                                    }))
                                                }
                                                className="resume-editor-textarea resume-editor-experience-description"
                                                rows={4}
                                            />
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setResumeData((currentResume) => ({
                                                ...currentResume,
                                                workExperience: currentResume.workExperience.filter(
                                                    (_, index) => index !== experienceIndex
                                                ),
                                            }))
                                        }
                                        className="resume-editor-delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    setResumeData((currentResume) => ({
                                        ...currentResume,
                                        workExperience: [
                                            ...currentResume.workExperience,
                                            { ...emptyWorkExperience },
                                        ],
                                    }))
                                }
                                className="resume-editor-add-button"
                            >
                                + Add Experience
                            </button>
                        </div>
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">
                            Projects
                        </h3>

                        <div className="resume-editor-education-list">
                            {resumeData.projects.map((project, projectIndex) => (
                                <div
                                    key={projectIndex}
                                    className="resume-editor-education-card"
                                >
                                    <div className="resume-editor-fields">
                                        {[
                                            ["name", "Project Name"],
                                            ["url", "Project URL"],
                                            ["startDate", "Start Date"],
                                            ["endDate", "End Date"],
                                        ].map(([field, label]) => (
                                            <label key={field} className="resume-editor-field">
                                                <span className="resume-editor-label">
                                                    {label}
                                                </span>
                                                <input
                                                    type={field === "url" ? "url" : "text"}
                                                    value={project[field]}
                                                    onChange={(event) =>
                                                        setResumeData((currentResume) => ({
                                                            ...currentResume,
                                                            projects: currentResume.projects.map(
                                                                (entry, index) =>
                                                                    index === projectIndex
                                                                        ? {
                                                                            ...entry,
                                                                            [field]: event.target.value,
                                                                        }
                                                                        : entry
                                                            ),
                                                        }))
                                                    }
                                                    className="resume-editor-input"
                                                />
                                            </label>
                                        ))}

                                        <label className="resume-editor-field">
                                            <span className="resume-editor-label">
                                                Description
                                            </span>
                                            <textarea
                                                value={project.description}
                                                onChange={(event) =>
                                                    setResumeData((currentResume) => ({
                                                        ...currentResume,
                                                        projects: currentResume.projects.map(
                                                            (entry, index) =>
                                                                index === projectIndex
                                                                    ? {
                                                                        ...entry,
                                                                        description: event.target.value,
                                                                    }
                                                                    : entry
                                                        ),
                                                    }))
                                                }
                                                className="resume-editor-textarea resume-editor-project-description"
                                                rows={4}
                                            />
                                        </label>

                                        <label className="resume-editor-field">
                                            <span className="resume-editor-label">
                                                Technologies
                                            </span>
                                            <input
                                                type="text"
                                                value={project.technologies.join(", ")}
                                                onChange={(event) =>
                                                    setResumeData((currentResume) => ({
                                                        ...currentResume,
                                                        projects: currentResume.projects.map(
                                                            (entry, index) =>
                                                                index === projectIndex
                                                                    ? {
                                                                        ...entry,
                                                                        technologies: event.target.value
                                                                            .split(",")
                                                                            .map((technology) => technology.trim())
                                                                            .filter(Boolean),
                                                                    }
                                                                    : entry
                                                        ),
                                                    }))
                                                }
                                                className="resume-editor-input"
                                            />
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setResumeData((currentResume) => ({
                                                ...currentResume,
                                                projects: currentResume.projects.filter(
                                                    (_, index) => index !== projectIndex
                                                ),
                                            }))
                                        }
                                        className="resume-editor-delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    setResumeData((currentResume) => ({
                                        ...currentResume,
                                        projects: [
                                            ...currentResume.projects,
                                            { ...emptyProject },
                                        ],
                                    }))
                                }
                                className="resume-editor-add-button"
                            >
                                + Add Project
                            </button>
                        </div>
                    </div>

                    <div className="resume-editor-card">
                        <h3 className="resume-editor-card-title">
                            Skills
                        </h3>

                        <div className="resume-editor-skills-list">
                            {resumeData.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className="resume-editor-skill-row">
                                    <input
                                        type="text"
                                        value={skill}
                                        onChange={(event) =>
                                            setResumeData((currentResume) => ({
                                                ...currentResume,
                                                skills: currentResume.skills.map(
                                                    (entry, index) =>
                                                        index === skillIndex
                                                            ? event.target.value
                                                            : entry
                                                ),
                                            }))
                                        }
                                        className="resume-editor-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setResumeData((currentResume) => ({
                                                ...currentResume,
                                                skills: currentResume.skills.filter(
                                                    (_, index) => index !== skillIndex
                                                ),
                                            }))
                                        }
                                        className="resume-editor-delete-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <div className="resume-editor-skill-row">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(event) => setNewSkill(event.target.value)}
                                    placeholder="New skill"
                                    className="resume-editor-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const trimmedSkill = newSkill.trim();
                                        if (!trimmedSkill) {
                                            return;
                                        }

                                        setResumeData((currentResume) => ({
                                            ...currentResume,
                                            skills: [...currentResume.skills, trimmedSkill],
                                        }));
                                        setNewSkill("");
                                    }}
                                    className="resume-editor-add-button"
                                >
                                    + Add Skill
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PREVIEW */}
                <section
                    className="resume-editor-preview-panel"
                    onWheel={handlePreviewWheel}
                >
                    <div className="resume-editor-preview-toolbar">
                        <button
                            type="button"
                            onClick={() =>
                                setPreviewScale((currentScale) =>
                                    Math.max(0.35, currentScale - 0.05)
                                )
                            }
                            className="resume-editor-zoom-button"
                            aria-label="Zoom out preview"
                        >
                            -
                        </button>
                        <span>{Math.round(previewScale * 100)}%</span>
                        <button
                            type="button"
                            onClick={() =>
                                setPreviewScale((currentScale) =>
                                    Math.min(1.2, currentScale + 0.05)
                                )
                            }
                            className="resume-editor-zoom-button"
                            aria-label="Zoom in preview"
                        >
                            +
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewScale(0.55)}
                            className="resume-editor-zoom-reset"
                        >
                            Reset
                        </button>
                    </div>

                    <div
                        className="resume-editor-preview"
                        style={{ "--preview-scale": previewScale }}
                    >
                        <TemplateComponent
                            resumeData={resumeData}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}

