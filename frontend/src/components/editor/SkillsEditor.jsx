function SkillsEditor({ value = [], onChange = () => { } }) {
    return (
        <section>
            <h2>Skills</h2>
            <textarea
                value={value.join(", ")}
                onChange={(event) => onChange(event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))}
                placeholder="JavaScript, React, Node.js"
                rows={4}
            />
        </section>
    );
}

export default SkillsEditor;
