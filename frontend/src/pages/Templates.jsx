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

    const handleUseTemplate = (templateId) => {
        navigate(`/editor?template=${templateId}`, {
            state: {
                roleResumeData,
                resumeData,
                targetRole: roleResumeData?.targetRole || "",
            },
        });
    };

    return (
        <main className="templates-page">
            <div className="templates-container">
                <header className="templates-heading">
                    <h1 className="templates-title">Choose a Resume Template</h1>
                </header>

                <div className="templates-grid">
                    {templates.map(({ id, name, component: TemplateComponent }) => (
                        <article className="template-card" key={id}>
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
                                <button
                                    type="button"
                                    onClick={() => handleUseTemplate(id)}
                                    className="template-use-button"
                                >
                                    Use Template
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
