function EducationEditor({ value = [], onChange = () => { } }) {
    return (
        <section>
            <h2>Education</h2>
            {value.map((entry, index) => (
                <fieldset key={entry.id || index}>
                    <input value={entry.school || ""} onChange={(event) => updateEntry(value, onChange, index, "school", event.target.value)} placeholder="School or university" />
                    <input value={entry.degree || ""} onChange={(event) => updateEntry(value, onChange, index, "degree", event.target.value)} placeholder="Degree or qualification" />
                    <input value={entry.startDate || ""} onChange={(event) => updateEntry(value, onChange, index, "startDate", event.target.value)} placeholder="Start date" />
                    <input value={entry.endDate || ""} onChange={(event) => updateEntry(value, onChange, index, "endDate", event.target.value)} placeholder="End date" />
                </fieldset>
            ))}
            <button type="button" onClick={() => onChange([...value, {}])}>Add education</button>
        </section>
    );
}

function updateEntry(entries, onChange, index, field, fieldValue) {
    onChange(entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: fieldValue } : entry));
}

export default EducationEditor;
