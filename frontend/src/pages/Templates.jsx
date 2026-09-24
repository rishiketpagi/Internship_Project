import { useLocation, useNavigate } from "react-router-dom";
import { templates } from "../data/templates";
import { sampleResumeData } from "../data/sampleResumeData";
import "../styles/Templates.css";

export default function Templates() {
    const navigate = useNavigate();
    const location = useLocation();
    const roleResumeData = location.state?.roleResumeData;
    const resumeData = roleResumeData?.candidateProfile
        || location.state?.resumeData
        || sampleResumeData;

    const handlePreviewTemplate = (templateId) => {
        navigate(`/resume-preview?template=${templateId}`, {
            state: {
                roleResumeData,
                resumeData,
                targetRole: location.state?.targetRole || roleResumeData?.targetRole || "",
                atsAnalysis: location.state?.atsAnalysis,
                jobDescription: location.state?.jobDescription,
                prompt: location.state?.prompt,
            },
        });
    };

    return (
        <main className="templates-page">
            <header className="templates-header">
                <div className="templates-header-inner">
                    <div>
                        <h1 className="templates-greeting">Explore Resume Templates</h1>
                        <p className="templates-subtext">Find the perfect design for your next career move.</p>
                    </div>
                </div>
            </header>

            <div className="templates-container">
                <div className="templates-grid">
                    {templates.map(({ id, name, component: TemplateComponent }) => (
                        <article
                            className="template-card"
                            key={id}
                            onClick={() => handlePreviewTemplate(id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    handlePreviewTemplate(id);
                                }
                            }}
                        >
                            <div className="template-preview-window">
                                <div className="template-preview-content">
                                    <TemplateComponent
                                        roleResumeData={roleResumeData}
                                        resumeData={resumeData}
                                    />
                                </div>
                            </div>
                            <div className="template-card-content">
                                <h2 className="template-card-title">{name}</h2>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
