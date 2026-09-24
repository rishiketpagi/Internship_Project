import { useState } from "react";

function SkillsEditor({ value = [], onChange = () => { } }) {
    const [draft, setDraft] = useState("");

    const addSkill = (e) => {
        if (e) e.preventDefault();
        const trimmedSkill = draft.trim();
        if (!trimmedSkill) return;
        
        // Prevent duplicates
        if (!value.includes(trimmedSkill)) {
            onChange([...value, trimmedSkill]);
        }
        setDraft("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const removeSkill = (index) => {
        onChange(value.filter((_, skillIndex) => skillIndex !== index));
    };

    return (
        <div className="resume-editor-skills-chips-container">
            <div className="resume-editor-skills-chips">
                {value.map((skill, index) => (
                    <div key={index} className="resume-editor-skill-chip">
                        <span>{skill}</span>
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="resume-editor-chip-remove"
                            aria-label={`Remove ${skill}`}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            <div className="resume-editor-skill-draft">
                <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a skill and press Enter"
                    className="resume-editor-chip-input"
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="resume-editor-add-button"
                >
                    Add
                </button>
            </div>
        </div>
    );
}

export default SkillsEditor;
