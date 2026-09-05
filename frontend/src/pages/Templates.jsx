import { useNavigate } from "react-router-dom";

import ModernTemplate from "../components/templates/ModernTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import "../styles/Templates.css";

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
        {
            name: "Expense Tracker",
            description:
                "Built an application for tracking daily and monthly expenses.",
            technologies: ["React", "Firebase"],
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

const templates = [
    {
        id: "modern",
        name: "Modern",
        description: "A clean two-column design with a modern professional look.",
        component: ModernTemplate,
    },
    {
        id: "professional",
        name: "Professional",
        description: "A traditional and structured layout suitable for professional roles.",
        component: ProfessionalTemplate,
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "A simple, clean layout focused on readability and content.",
        component: MinimalTemplate,
    },
];

export default function Templates() {
    const navigate = useNavigate();

    const handleUseTemplate = (templateId) => {
        navigate(`/editor?template=${templateId}`);
    };

    return (
        <main className="templates-page">
            <div className="templates-container">
                <div className="templates-heading">
                    <h1 className="templates-title">
                        Choose a Resume Template
                    </h1>

                    <p className="templates-description">
                        Select a template for your resume. You can change it later.
                    </p>
                </div>

                <div className="templates-grid">
                    {templates.map((template) => {
                        const TemplateComponent = template.component;

                        return (
                            <div
                                key={template.id}
                                className="template-card"
                            >
                                <div className="template-preview-window">
                                    <div className="template-preview-content">
                                        <TemplateComponent
                                            resumeData={sampleResumeData}
                                        />
                                    </div>
                                </div>

                                <div className="template-card-content">
                                    <h2 className="template-card-title">
                                        {template.name}
                                    </h2>

                                    <p className="template-card-description">
                                        {template.description}
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleUseTemplate(template.id)
                                        }
                                        className="template-use-button"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
