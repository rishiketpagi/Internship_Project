import { getDateRange, getText } from "./templateUtils";
import "./Template.css";

export default function ModernTemplate({ roleResumeData, resumeData = {}, variant = "modern" }) {
    const data = roleResumeData?.candidateProfile || resumeData;
    return <ResumeContent data={data} className={`resume-template-${variant}`} />;
}

function ResumeContent({ data, className }) {
    const {
        personalInfo = {},
        professionalSummary,
        education = [],
        workExperience = [],
        internships = [],
        projects = [],
        skills = [],
        certifications = [],
        achievements = [],
    } = data;
    const experiences = [...workExperience, ...internships];

    return (
        <article className={`resume-template ${className}`}>
            <header className="resume-header">
                <h1>{personalInfo.name || "Your Name"}</h1>
                <p className="resume-contact">
                    {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
                        .filter(Boolean)
                        .map((item) => <span key={item}>{item}</span>)}
                </p>
            </header>
            <ResumeSections
                professionalSummary={professionalSummary}
                experiences={experiences}
                projects={projects}
                education={education}
                skills={skills}
                certifications={certifications}
                achievements={achievements}
            />
        </article>
    );
}

function ResumeSections({ professionalSummary, experiences, projects, education, skills, certifications, achievements }) {
    return <>
        {professionalSummary && <section className="resume-section"><h2 className="resume-section-heading">Professional Summary</h2><p>{professionalSummary}</p></section>}
        {skills.length > 0 && <section className="resume-section"><h2 className="resume-section-heading">Skills</h2><p className="resume-skills">{skills.map(getText).filter(Boolean).join(" | ")}</p></section>}
        {experiences.length > 0 && <section className="resume-section"><h2 className="resume-section-heading">Work Experience</h2>{experiences.map((entry, index) => <Entry key={`${entry.company}-${entry.jobTitle}-${index}`} entry={entry} />)}</section>}
        {projects.length > 0 && <section className="resume-section"><h2 className="resume-section-heading">Projects</h2>{projects.map((project, index) => <Entry key={`${project.name}-${index}`} entry={project} project />)}</section>}
        {education.length > 0 && <section className="resume-section"><h2 className="resume-section-heading">Education</h2>{education.map((entry, index) => <Entry key={`${entry.institution}-${index}`} entry={entry} education />)}</section>}
        {certifications.length > 0 && <section className="resume-section"><h2 className="resume-section-heading">Certifications</h2><ul className="resume-list">{certifications.map((item, index) => <li key={`${getText(item)}-${index}`}>{getText(item)}</li>)}</ul></section>}
        {achievements.length > 0 && <section className="resume-section"><h2 className="resume-section-heading">Achievements</h2><ul className="resume-list">{achievements.map((item, index) => <li key={`${getText(item)}-${index}`}>{getText(item)}</li>)}</ul></section>}
    </>;
}

function Entry({ entry, project = false, education = false }) {
    const title = project ? entry.name : education ? entry.institution : entry.jobTitle;
    const meta = project
        ? [entry.technologies?.join(", "), entry.url].filter(Boolean).join(" | ")
        : education
            ? [entry.degree, entry.field && `in ${entry.field}`, entry.grade && `Grade: ${entry.grade}`].filter(Boolean).join(" ")
            : [entry.company, entry.location, getDateRange(entry)].filter(Boolean).join(" | ");
    return <div className="resume-entry">
        <h3 className="resume-entry-heading">{title}</h3>
        {meta && <p className="resume-entry-meta">{meta}</p>}
        {entry.description && <p className="resume-entry-description">{entry.description}</p>}
        {entry.responsibilities?.length > 0 && <ul className="resume-list">{entry.responsibilities.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>}
    </div>;
}
