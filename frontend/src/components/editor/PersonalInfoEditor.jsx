function PersonalInfoEditor({ value = {}, onChange = () => { } }) {
    const updateField = (field) => (event) => {
        onChange({ ...value, [field]: event.target.value });
    };

    return (
        <div className="resume-editor-fields">
            {[
                ["name", "Name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["location", "Location", "text"],
                ["linkedin", "LinkedIn", "url"],
                ["github", "GitHub", "url"],
                ["portfolio", "Portfolio", "url"],
            ].map(([field, label, type]) => (
                <label key={field} className="resume-editor-field">
                    <span className="resume-editor-label">{label}</span>
                    <input
                        type={type}
                        value={value[field] || ""}
                        onChange={updateField(field)}
                        className="resume-editor-input"
                    />
                </label>
            ))}
        </div>
    );
}

export default PersonalInfoEditor;
