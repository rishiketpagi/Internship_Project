export default function MinimalTemplate({ resumeData }) {
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
            <header className="border-b border-gray-300 pb-6 text-center">

                <h1 className="text-4xl font-light tracking-[0.15em] uppercase">
                    {personalInfo?.name}
                </h1>

                <p className="mt-3 text-xs font-semibold tracking-[0.35em] text-gray-500">
                    COMPUTER ENGINEER
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600">
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
                </div>
            </header>

            {/* SUMMARY */}
            {professionalSummary && (
                <section className="mt-7">
                    <h2 className="mb-3 text-xs font-bold tracking-[0.25em]">
                        SUMMARY
                    </h2>

                    <p className="max-w-3xl text-sm leading-6 text-gray-600">
                        {professionalSummary}
                    </p>
                </section>
            )}

            {/* EDUCATION */}
            {education?.length > 0 && (
                <section className="mt-7 border-t border-gray-200 pt-5">
                    <h2 className="mb-4 text-xs font-bold tracking-[0.25em]">
                        EDUCATION
                    </h2>

                    {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between gap-4">
                                <strong className="text-sm">
                                    {edu.institution}
                                </strong>

                                <span className="text-xs text-gray-500">
                                    {edu.startDate}
                                    {edu.endDate &&
                                        ` — ${edu.endDate}`}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-600">
                                {edu.degree}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {/* EXPERIENCE */}
            {workExperience?.length > 0 && (
                <section className="mt-7 border-t border-gray-200 pt-5">
                    <h2 className="mb-4 text-xs font-bold tracking-[0.25em]">
                        EXPERIENCE
                    </h2>

                    {workExperience?.map((job, index) => (
                        <div key={`work-${index}`} className="mb-5">
                            <div className="flex justify-between gap-4">
                                <div>
                                    <strong className="text-sm">
                                        {job.jobTitle}
                                    </strong>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {job.company}
                                    </p>
                                </div>

                                <span className="whitespace-nowrap text-xs text-gray-500">
                                    {job.startDate}
                                    {job.endDate &&
                                        ` — ${job.endDate}`}
                                </span>
                            </div>

                            {job.description && (
                                <p className="mt-2 text-sm leading-5 text-gray-600">
                                    {job.description}
                                </p>
                            )}
                        </div>
                    ))}

                </section>
            )}

            {/* PROJECTS */}
            {projects?.length > 0 && (
                <section className="mt-7 border-t border-gray-200 pt-5">
                    <h2 className="mb-4 text-xs font-bold tracking-[0.25em]">
                        PROJECTS
                    </h2>

                    {projects.map((project, index) => (
                        <div key={index} className="mb-5">

                            <div className="flex flex-wrap items-baseline gap-3">
                                <strong className="text-sm">
                                    {project.name}
                                </strong>

                                {project.technologies?.length > 0 && (
                                    <span className="text-xs text-gray-500">
                                        {project.technologies.join(", ")}
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-sm leading-5 text-gray-600">
                                {project.description}
                            </p>

                            {project.url && (
                                <p className="mt-1 text-xs text-gray-500">
                                    {project.url}
                                </p>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* SKILLS */}
            {skills?.length > 0 && (
                <section className="mt-7 border-t border-gray-200 pt-5">
                    <h2 className="mb-3 text-xs font-bold tracking-[0.25em]">
                        SKILLS
                    </h2>

                    <p className="text-sm leading-6 text-gray-600">
                        {skills.join(", ")}
                    </p>
                </section>
            )}

            {/* CERTIFICATIONS */}
            {certifications?.length > 0 && (
                <section className="mt-7 border-t border-gray-200 pt-5">
                    <h2 className="mb-3 text-xs font-bold tracking-[0.25em]">
                        CERTIFICATIONS
                    </h2>

                    {certifications.map((cert, index) => (
                        <p
                            key={index}
                            className="mb-2 text-sm text-gray-600"
                        >
                            <strong>{cert.name}</strong>

                            {cert.issuer &&
                                ` — ${cert.issuer}`}
                        </p>
                    ))}
                </section>
            )}

            {/* ACHIEVEMENTS */}
            {achievements?.length > 0 && (
                <section className="mt-7 border-t border-gray-200 pt-5">
                    <h2 className="mb-3 text-xs font-bold tracking-[0.25em]">
                        ACHIEVEMENTS
                    </h2>

                    <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {achievements.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

