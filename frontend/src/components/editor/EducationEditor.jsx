function EducationEditor({ value = [], onChange = () => { } }) {
    const emptyEducation = {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        grade: "",
    };

    return (
        <div className="resume-editor-education-list">
            {value.map((entry, index) => (
                <div key={index} className="resume-editor-education-card">
                    <div className="resume-editor-fields">
                        {[
                            ["institution", "Institution"],
                            ["degree", "Degree"],
                            ["field", "Field of Study"],
                            ["startDate", "Start Date"],
                            ["endDate", "End Date"],
                            ["grade", "Grade"],
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
                onClick={() => onChange([...value, { ...emptyEducation }])}
                className="resume-editor-add-button"
            >
                + Add Education
            </button>
        </div>
    );
}

function updateEntry(entries, onChange, index, field, fieldValue) {
    onChange(entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: fieldValue } : entry));
}

export default EducationEditor;
