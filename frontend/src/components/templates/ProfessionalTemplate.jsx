export default function ProfessionalTemplate({ resumeData }) {
    const {
        personalInfo,
        professionalSummary,
        education,
        workExperience,
        projects,
        skills,
        certifications,
        achievements,
    } = resumeData;

    return (
        <div className="mx-auto min-h-[297mm] w-[210mm] bg-white px-12 py-10 text-gray-900 shadow-lg">

            {/* HEADER */}
            <header className="border-b-2 border-gray-900 pb-5 text-center">

                <h1 className="text-3xl font-bold uppercase tracking-wide">
                    {personalInfo?.name}
                </h1>

                <p className="mt-1 text-sm font-medium">
                    Computer Engineer
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    {personalInfo?.email && (
                        <span>{personalInfo.email}</span>
                    )}

                    {personalInfo?.phone && (
                        <span>{personalInfo.phone}</span>
                    )}

                    {personalInfo?.location && (
                        <span>{personalInfo.location}</span>
                    )}

                    {personalInfo?.linkedin && (
                        <span>{personalInfo.linkedin}</span>
                    )}

                    {personalInfo?.github && (
                        <span>{personalInfo.github}</span>
                    )}

                    {personalInfo?.portfolio && (
                        <span>{personalInfo.portfolio}</span>
                    )}
                </div>
            </header>

            {/* SUMMARY */}
            {professionalSummary && (
                <section className="mt-6">
                    <h2 className="mb-2 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Professional Summary
                    </h2>

                    <p className="text-sm leading-5 text-gray-700">
                        {professionalSummary}
                    </p>
                </section>
            )}

            {/* EDUCATION */}
            {education?.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-3 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Education
                    </h2>

                    {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between">
                                <strong className="text-sm">
                                    {edu.institution}
                                </strong>

                                <span className="text-xs text-gray-600">
                                    {edu.startDate}
                                    {edu.endDate &&
                                        ` - ${edu.endDate}`}
                                </span>
                            </div>

                            <p className="text-sm">
                                {edu.degree}
                            </p>

                            {edu.field && (
                                <p className="text-xs text-gray-600">
                                    {edu.field}
                                </p>
                            )}

                            {edu.grade && (
                                <p className="text-xs text-gray-600">
                                    Grade: {edu.grade}
                                </p>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* EXPERIENCE */}
            {workExperience?.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-3 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Experience
                    </h2>

                    {workExperience?.map((job, index) => (
                        <div key={`work-${index}`} className="mb-5">
                            <div className="flex justify-between">
                                <strong className="text-sm">
                                    {job.jobTitle}
                                </strong>

                                <span className="text-xs text-gray-600">
                                    {job.startDate}
                                    {job.endDate &&
                                        ` - ${job.endDate}`}
                                </span>
                            </div>

                            <p className="text-sm font-medium">
                                {job.company}
                                {job.location &&
                                    `, ${job.location}`}
                            </p>

                            {job.description && (
                                <p className="mt-1 text-sm leading-5 text-gray-700">
                                    {job.description}
                                </p>
                            )}

                            {job.responsibilities?.length > 0 && (
                                <ul className="mt-1 list-disc pl-5 text-sm leading-5 text-gray-700">
                                    {job.responsibilities.map(
                                        (item, i) => (
                                            <li key={i}>{item}</li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    ))}

                </section>
            )}

            {/* PROJECTS */}
            {projects?.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-3 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Projects
                    </h2>

                    {projects.map((project, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between">
                                <strong className="text-sm">
                                    {project.name}
                                </strong>

                                {project.technologies?.length > 0 && (
                                    <span className="text-xs text-gray-600">
                                        {project.technologies.join(" • ")}
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-sm leading-5 text-gray-700">
                                {project.description}
                            </p>

                            {project.url && (
                                <p className="text-xs text-gray-600">
                                    {project.url}
                                </p>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* SKILLS */}
            {skills?.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-2 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Skills
                    </h2>

                    <p className="text-sm leading-6 text-gray-700">
                        {skills.join(" • ")}
                    </p>
                </section>
            )}

            {/* CERTIFICATIONS */}
            {certifications?.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-2 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Certifications
                    </h2>

                    <ul className="list-disc pl-5 text-sm text-gray-700">
                        {certifications.map((cert, index) => (
                            <li key={index}>
                                {cert.name}
                                {cert.issuer &&
                                    ` — ${cert.issuer}`}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* ACHIEVEMENTS */}
            {achievements?.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-2 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wide">
                        Achievements
                    </h2>

                    <ul className="list-disc pl-5 text-sm text-gray-700">
                        {achievements.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
