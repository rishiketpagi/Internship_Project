function ExperienceEditor({ value = [], onChange = () => { } }) {
    return (
        <section>
            <h2>Experience</h2>
            {value.map((entry, index) => (
                <fieldset key={entry.id || index}>
                    <input value={entry.company || ""} onChange={(event) => updateEntry(value, onChange, index, "company", event.target.value)} placeholder="Company" />
                    <input value={entry.role || ""} onChange={(event) => updateEntry(value, onChange, index, "role", event.target.value)} placeholder="Job title" />
                    <input value={entry.startDate || ""} onChange={(event) => updateEntry(value, onChange, index, "startDate", event.target.value)} placeholder="Start date" />
                    <input value={entry.endDate || ""} onChange={(event) => updateEntry(value, onChange, index, "endDate", event.target.value)} placeholder="End date" />
                    <textarea value={entry.description || ""} onChange={(event) => updateEntry(value, onChange, index, "description", event.target.value)} placeholder="Describe your responsibilities and achievements" rows={4} />
                </fieldset>
            ))}
            <button type="button" onClick={() => onChange([...value, {}])}>Add experience</button>
        </section>
    );
}

function updateEntry(entries, onChange, index, field, fieldValue) {
    onChange(entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: fieldValue } : entry));
}

export default ExperienceEditor;
