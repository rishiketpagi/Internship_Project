import { useState } from "react";

function SkillsEditor({ value = [], onChange = () => { } }) {
    const [draft, setDraft] = useState("");

    const addSkill = () => {
        const trimmedSkill = draft.trim();
        if (!trimmedSkill) {
            return;
        }

        onChange([...value, trimmedSkill]);
        setDraft("");
    };

    const updateSkill = (index, nextValue) => {
        onChange(value.map((skill, skillIndex) => skillIndex === index ? nextValue : skill));
    };

    return (
        <div className="resume-editor-skills-list">
            {value.map((skill, index) => (
                <div key={index} className="resume-editor-skill-row">
                    <input
                        type="text"
                        value={skill}
                        onChange={(event) => updateSkill(index, event.target.value)}
                        className="resume-editor-input"
                    />
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((_, skillIndex) => skillIndex !== index))}
                        className="resume-editor-delete-button"
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div className="resume-editor-skill-row">
                <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="New skill"
                    className="resume-editor-input"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="resume-editor-add-button"
                >
                    + Add Skill
                </button>
            </div>
        </div>
    );
}

export default SkillsEditor;
