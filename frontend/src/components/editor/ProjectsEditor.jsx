function ProjectsEditor({ value = [], onChange = () => { } }) {
    return (
        <section>
            <h2>Projects</h2>
            {value.map((project, index) => (
                <fieldset key={project.id || index}>
                    <input value={project.name || ""} onChange={(event) => updateEntry(value, onChange, index, "name", event.target.value)} placeholder="Project name" />
                    <input value={project.url || ""} onChange={(event) => updateEntry(value, onChange, index, "url", event.target.value)} placeholder="Project URL" />
                    <textarea value={project.description || ""} onChange={(event) => updateEntry(value, onChange, index, "description", event.target.value)} placeholder="Describe the project and your contribution" rows={4} />
                </fieldset>
            ))}
            <button type="button" onClick={() => onChange([...value, {}])}>Add project</button>
        </section>
    );
}

function updateEntry(entries, onChange, index, field, fieldValue) {
    onChange(entries.map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: fieldValue } : entry));
}

export default ProjectsEditor;
