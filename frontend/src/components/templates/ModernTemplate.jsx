export default function ModernTemplate({ resumeData }) {
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
        <div className="mx-auto grid w-[210mm] min-h-[297mm] grid-cols-[32%_68%] bg-white text-gray-800 shadow-lg">

            {/* SIDEBAR */}
            <aside className="bg-slate-900 px-7 py-10 text-white">

                <div className="mb-10">
                    <h1 className="text-3xl font-bold uppercase tracking-wide">
                        {personalInfo?.name}
                    </h1>

                    <p className="mt-2 text-sm text-slate-300">
                        Computer Engineer
                    </p>
                </div>

                {/* CONTACT */}
                <section className="mb-8">
                    <h2 className="mb-4 border-b border-slate-600 pb-2 text-sm font-bold tracking-widest">
                        CONTACT
                    </h2>

                    <div className="space-y-3 text-xs text-slate-300 break-words">
                        {personalInfo?.email && (
                            <p>{personalInfo.email}</p>
                        )}

                        {personalInfo?.phone && (
                            <p>{personalInfo.phone}</p>
                        )}

                        {personalInfo?.location && (
                            <p>{personalInfo.location}</p>
                        )}

                        {personalInfo?.linkedin && (
                            <p>{personalInfo.linkedin}</p>
                        )}

                        {personalInfo?.github && (
                            <p>{personalInfo.github}</p>
                        )}

                        {personalInfo?.portfolio && (
                            <p>{personalInfo.portfolio}</p>
                        )}
                    </div>
                </section>

                {/* SKILLS */}
                {skills?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="mb-4 border-b border-slate-600 pb-2 text-sm font-bold tracking-widest">
                            SKILLS
                        </h2>

                        <ul className="space-y-2 text-sm text-slate-300">
                            {skills.map((skill, index) => (
                                <li key={index}>• {skill}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* EDUCATION */}
                {education?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="mb-4 border-b border-slate-600 pb-2 text-sm font-bold tracking-widest">
                            EDUCATION
                        </h2>

                        <div className="space-y-5">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <h3 className="text-sm font-semibold">
                                        {edu.institution}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-300">
                                        {edu.degree}
                                    </p>

                                    {(edu.startDate || edu.endDate) && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            {edu.startDate}
                                            {edu.endDate &&
                                                ` - ${edu.endDate}`}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CERTIFICATIONS */}
                {certifications?.length > 0 && (
                    <section>
                        <h2 className="mb-4 border-b border-slate-600 pb-2 text-sm font-bold tracking-widest">
                            CERTIFICATIONS
                        </h2>

                        <div className="space-y-3 text-xs text-slate-300">
                            {certifications.map((cert, index) => (
                                <p key={index}>
                                    {cert.name}
                                </p>
                            ))}
                        </div>
                    </section>
                )}
            </aside>

            {/* MAIN CONTENT */}
            <main className="px-9 py-10">

                {/* SUMMARY */}
                {professionalSummary && (
                    <section className="mb-8">
                        <h2 className="mb-3 border-b-2 border-slate-800 pb-2 text-sm font-bold tracking-widest">
                            PROFESSIONAL SUMMARY
                        </h2>

                        <p className="text-sm leading-6 text-gray-600">
                            {professionalSummary}
                        </p>
                    </section>
                )}

                {/* EXPERIENCE */}
                {workExperience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="mb-5 border-b-2 border-slate-800 pb-2 text-sm font-bold tracking-widest">
                            EXPERIENCE
                        </h2>

                        {workExperience?.map((job, index) => (
                            <div
                                key={`work-${index}`}
                                className="mb-6"
                            >
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold">
                                            {job.jobTitle}
                                        </h3>

                                        <p className="text-sm text-slate-600">
                                            {job.company}
                                            {job.location &&
                                                ` • ${job.location}`}
                                        </p>
                                    </div>

                                    <p className="whitespace-nowrap text-xs text-slate-500">
                                        {job.startDate}
                                        {job.endDate &&
                                            ` - ${job.endDate}`}
                                    </p>
                                </div>

                                {job.description && (
                                    <p className="mt-2 text-sm leading-5 text-gray-600">
                                        {job.description}
                                    </p>
                                )}

                                {job.responsibilities?.length > 0 && (
                                    <ul className="mt-2 list-disc pl-5 text-sm leading-5 text-gray-600">
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
                    <section className="mb-8">
                        <h2 className="mb-5 border-b-2 border-slate-800 pb-2 text-sm font-bold tracking-widest">
                            PROJECTS
                        </h2>

                        {projects.map((project, index) => (
                            <div key={index} className="mb-5">
                                <div className="flex items-baseline justify-between gap-3">
                                    <h3 className="font-bold">
                                        {project.name}
                                    </h3>

                                    {project.technologies?.length > 0 && (
                                        <span className="text-xs text-blue-600">
                                            {project.technologies.join(" • ")}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm leading-5 text-gray-600">
                                    {project.description}
                                </p>

                                {project.url && (
                                    <p className="mt-1 text-xs text-blue-600">
                                        {project.url}
                                    </p>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* ACHIEVEMENTS */}
                {achievements?.length > 0 && (
                    <section>
                        <h2 className="mb-4 border-b-2 border-slate-800 pb-2 text-sm font-bold tracking-widest">
                            ACHIEVEMENTS
                        </h2>

                        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                            {achievements.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </div>
    );
}