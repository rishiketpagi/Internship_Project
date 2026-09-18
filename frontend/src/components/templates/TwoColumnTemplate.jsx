import { getDateRange, getText } from "./templateUtils";
import InlineEditSection from "../editor-v2/InlineEditSection";
import "./Template.css";

/*
 * Two-Column — left rail (name, contact, skills), right (everything else).
 * For designers, PMs, hybrids.
 */
export default function TwoColumnTemplate({ roleResumeData, resumeData = {}, onSectionEdit }) {
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
        <article className="resume-template resume-template-two-col">
            <div className="resume-two-col-grid">
                {/* LEFT RAIL */}
                <aside className="resume-two-col-left">
                    <InlineEditSection sectionKey="personalInfo" title="Personal" onEdit={onSectionEdit}>
                        <header className="resume-header">
                            <h1>{personalInfo.name || "Your Name"}</h1>
                        </header>
                    </InlineEditSection>

                    <div className="resume-section">
                        <h2 className="resume-section-heading">Contact</h2>
                        <ul className="resume-contact-list">
                            {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.portfolio]
                                .filter(Boolean)
                                .map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </div>

                    {skills.length > 0 && (
                        <InlineEditSection sectionKey="skills" title="Skills" onEdit={onSectionEdit}>
                            <section className="resume-section">
                                <h2 className="resume-section-heading">Skills</h2>
                                <ul className="resume-skills-list">
                                    {skills.map(getText).filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </section>
                        </InlineEditSection>
                    )}

                    {education.length > 0 && (
                        <InlineEditSection sectionKey="education" title="Education" onEdit={onSectionEdit}>
                            <section className="resume-section">
                                <h2 className="resume-section-heading">Education</h2>
                                {education.map((entry, i) => (
                                    <div key={i} className="resume-entry">
                                        <h3 className="resume-entry-heading">{entry.institution}</h3>
                                        <p className="resume-entry-meta">
                                            {[entry.degree, entry.field && `in ${entry.field}`].filter(Boolean).join(" ")}
                                        </p>
                                        <p className="resume-entry-meta">{[entry.startDate, entry.endDate].filter(Boolean).join(" — ")}</p>
                                    </div>
                                ))}
                            </section>
                        </InlineEditSection>
                    )}
                </aside>

                {/* RIGHT MAIN */}
                <main className="resume-two-col-right">
                    {professionalSummary && (
                        <InlineEditSection sectionKey="summary" title="Summary" onEdit={onSectionEdit}>
                            <section className="resume-section">
                                <h2 className="resume-section-heading">Profile</h2>
                                <p>{professionalSummary}</p>
                            </section>
                        </InlineEditSection>
                    )}

                    {experiences.length > 0 && (
                        <InlineEditSection sectionKey="experience" title="Experience" onEdit={onSectionEdit}>
                            <section className="resume-section">
                                <h2 className="resume-section-heading">Experience</h2>
                                {experiences.map((entry, i) => (
                                    <div key={i} className="resume-entry">
                                        <h3 className="resume-entry-heading">{entry.jobTitle}</h3>
                                        <p className="resume-entry-meta">{[entry.company, entry.location, getDateRange(entry)].filter(Boolean).join(" · ")}</p>
                                        {entry.description && <p className="resume-entry-description">{entry.description}</p>}
                                        {entry.responsibilities?.length > 0 && (
                                            <ul className="resume-list">
                                                {entry.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                                            </ul>
                                        )}
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
                                    <div key={i} className="resume-entry">
                                        <h3 className="resume-entry-heading">{project.name}</h3>
                                        <p className="resume-entry-meta">{[project.technologies?.join(", "), project.url].filter(Boolean).join(" | ")}</p>
                                        {project.description && <p className="resume-entry-description">{project.description}</p>}
                                    </div>
                                ))}
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
                </main>
            </div>
        </article>
    );
}
