function ExperienceEditor({ value = [], onChange = () => { } }) {
    const emptyExperience = {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        responsibilities: [],
    };

    return (
        <div className="resume-editor-education-list">
            {value.map((entry, index) => (
                <div key={index} className="resume-editor-education-card">
                    <div className="resume-editor-fields">
                        {[
                            ["jobTitle", "Job Title"],
                            ["company", "Company"],
                            ["location", "Location"],
                            ["startDate", "Start Date"],
                            ["endDate", "End Date"],
                        ].map(([field, label]) => (
                            <label key={field} className="resume-editor-field">
                                <span className="resume-editor-label">{label}</span>
                                <input
                                    type="text"
                                    value={entry[field] || ""}
                                    onChange={(event) => updateEntry(value, onChange, index, field, event.target.value)}
                                    className="resume-editor-input"
                                />
                            </label>
                        ))}

                        <label className="resume-editor-field">
                            <span className="resume-editor-label">Description</span>
                            <textarea
                                value={entry.description || ""}
                                onChange={(event) => updateEntry(value, onChange, index, "description", event.target.value)}
                                className="resume-editor-textarea resume-editor-experience-description"
                                rows={4}
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
                onClick={() => onChange([...value, { ...emptyExperience }])}
                className="resume-editor-add-button"
            >
                + Add Experience
            </button>
        </div>
    );
}

function updateEntry(entries, onChange, index, field, fieldValue) {
    onChange(entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: fieldValue } : entry));
}

export default ExperienceEditor;
