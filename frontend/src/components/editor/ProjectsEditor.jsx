function ProjectsEditor({ value = [], onChange = () => { } }) {
    const emptyProject = {
        name: "",
        description: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
    };

    return (
        <div className="resume-editor-education-list">
            {value.map((project, index) => (
                <div key={index} className="resume-editor-education-card">
                    <div className="resume-editor-fields">
                        {[
                            ["name", "Project Name"],
                            ["url", "Project URL"],
                            ["startDate", "Start Date"],
                            ["endDate", "End Date"],
                        ].map(([field, label]) => (
                            <label key={field} className="resume-editor-field">
                                <span className="resume-editor-label">{label}</span>
                                <input
                                    type={field === "url" ? "url" : "text"}
                                    value={project[field] || ""}
                                    onChange={(event) => updateEntry(value, onChange, index, field, event.target.value)}
                                    className="resume-editor-input"
                                />
                            </label>
                        ))}

                        <label className="resume-editor-field">
                            <span className="resume-editor-label">Description</span>
                            <textarea
                                value={project.description || ""}
                                onChange={(event) => updateEntry(value, onChange, index, "description", event.target.value)}
                                className="resume-editor-textarea resume-editor-project-description"
                                rows={4}
                            />
                        </label>

                        <label className="resume-editor-field">
                            <span className="resume-editor-label">Technologies</span>
                            <input
                                type="text"
                                value={project.technologies?.join(", ") || ""}
                                onChange={(event) => updateEntry(
                                    value,
                                    onChange,
                                    index,
                                    "technologies",
                                    event.target.value
                                        .split(",")
                                        .map((technology) => technology.trim())
                                        .filter(Boolean)
                                )}
                                className="resume-editor-input"
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={() => onChange(value.filter((_, entryIndex) => entryIndex !== index))}
                        className="resume-editor-delete-button"
                    >
                        Delete
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => onChange([...value, { ...emptyProject }])}
                className="resume-editor-add-button"
            >
                + Add Project
            </button>
        </div>
    );
}

function updateEntry(entries, onChange, index, field, fieldValue) {
    onChange(entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: fieldValue } : entry));
}

export default ProjectsEditor;
