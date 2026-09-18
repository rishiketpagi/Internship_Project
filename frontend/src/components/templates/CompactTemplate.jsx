import { getDateRange, getText } from "./templateUtils";
import InlineEditSection from "../editor-v2/InlineEditSection";
import "./Template.css";

/*
 * Compact — dense single-column for senior folks with long history.
 * Smaller scale, tighter rhythm, same data tree.
 */
export default function CompactTemplate({ roleResumeData, resumeData = {}, onSectionEdit }) {
    const data = roleResumeData?.candidateProfile || resumeData;
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
        <article className="resume-template resume-template-compact">
            <InlineEditSection sectionKey="personalInfo" title="Personal" onEdit={onSectionEdit}>
                <header className="resume-header">
                    <h1>{personalInfo.name || "Your Name"}</h1>
                    <p className="resume-contact">
                        {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
                            .filter(Boolean)
                            .map((item, i, arr) => (
                                <span key={item}>
                                    {item}
                                    {i < arr.length - 1 && <span className="dot" aria-hidden="true"> · </span>}
                                </span>
                            ))}
                    </p>
                </header>
            </InlineEditSection>

            {professionalSummary && (
                <InlineEditSection sectionKey="summary" title="Summary" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Summary</h2>
                        <p>{professionalSummary}</p>
                    </section>
                </InlineEditSection>
            )}

            {experiences.length > 0 && (
                <InlineEditSection sectionKey="experience" title="Experience" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Experience</h2>
                        {experiences.map((entry, i) => (
                            <div key={`${entry.company}-${i}`} className="resume-entry">
                                <div className="resume-entry-row">
                                    <h3 className="resume-entry-heading">{entry.jobTitle}</h3>
                                    <span className="resume-entry-dates">{getDateRange(entry)}</span>
                                </div>
                                <p className="resume-entry-meta">{[entry.company, entry.location].filter(Boolean).join(" — ")}</p>
                                {entry.description && <p className="resume-entry-description">{entry.description}</p>}
                                {entry.responsibilities?.length > 0 && (
                                    <ul className="resume-list">
                                        {entry.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                </InlineEditSection>
            )}

            {education.length > 0 && (
                <InlineEditSection sectionKey="education" title="Education" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Education</h2>
                        {education.map((entry, i) => (
                            <div key={`${entry.institution}-${i}`} className="resume-entry">
                                <div className="resume-entry-row">
                                    <h3 className="resume-entry-heading">{entry.institution}</h3>
                                    <span className="resume-entry-dates">{[entry.startDate, entry.endDate].filter(Boolean).join(" — ")}</span>
                                </div>
                                <p className="resume-entry-meta">{[entry.degree, entry.field && `in ${entry.field}`, entry.grade && `Grade: ${entry.grade}`].filter(Boolean).join(" ")}</p>
                            </div>
                        ))}
                    </section>
                </InlineEditSection>
            )}

            {projects.length > 0 && (
                <InlineEditSection sectionKey="projects" title="Projects" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Projects</h2>
                        {projects.map((project, i) => (
                            <div key={`${project.name}-${i}`} className="resume-entry">
                                <h3 className="resume-entry-heading">{project.name}</h3>
                                <p className="resume-entry-meta">{[project.technologies?.join(", "), project.url].filter(Boolean).join(" | ")}</p>
                                {project.description && <p className="resume-entry-description">{project.description}</p>}
                            </div>
                        ))}
                    </section>
                </InlineEditSection>
            )}

            {skills.length > 0 && (
                <InlineEditSection sectionKey="skills" title="Skills" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Skills</h2>
                        <p className="resume-skills">{skills.map(getText).filter(Boolean).join(", ")}</p>
                    </section>
                </InlineEditSection>
            )}

            {certifications.length > 0 && (
                <InlineEditSection sectionKey="certifications" title="Certifications" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Certifications</h2>
                        <ul className="resume-list">
                            {certifications.map((item, i) => <li key={i}>{getText(item)}</li>)}
                        </ul>
                    </section>
                </InlineEditSection>
            )}

            {achievements.length > 0 && (
                <InlineEditSection sectionKey="achievements" title="Achievements" onEdit={onSectionEdit}>
                    <section className="resume-section">
                        <h2 className="resume-section-heading">Achievements</h2>
                        <ul className="resume-list">
                            {achievements.map((item, i) => <li key={i}>{getText(item)}</li>)}
                        </ul>
                    </section>
                </InlineEditSection>
            )}
        </article>
    );
}
