import { useState } from "react";

function SkillsEditor({ value = [], onChange = () => { } }) {
    const normalizedValue = value.map(v => typeof v === 'string' ? { name: v, isHidden: false } : v);
    const [draft, setDraft] = useState("");

    const addSkill = (e) => {
        if (e) e.preventDefault();
        const trimmedSkill = draft.trim();
        if (!trimmedSkill) return;
        
        // Prevent duplicates
        if (!normalizedValue.find(s => s.name === trimmedSkill)) {
            onChange([...normalizedValue, { name: trimmedSkill, isHidden: false }]);
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
        onChange(normalizedValue.filter((_, skillIndex) => skillIndex !== index));
    };

    const toggleHide = (index) => {
        onChange(normalizedValue.map((skill, skillIndex) => 
            skillIndex === index ? { ...skill, isHidden: !skill.isHidden } : skill
        ));
    };

    return (
        <div className="resume-editor-skills-chips-container">
            <div className="resume-editor-skills-chips">
                {normalizedValue.map((skill, index) => (
                    <div key={index} className="resume-editor-skill-chip" style={{ opacity: skill.isHidden ? 0.5 : 1, transition: 'all 0.2s', border: skill.isHidden ? '1px dashed #ef4444' : '' }}>
                        <span 
                            onClick={() => toggleHide(index)} 
                            title={skill.isHidden ? "Click to show on resume" : "Click to hide from resume"}
                            style={{ cursor: 'pointer', textDecoration: skill.isHidden ? 'line-through' : 'none' }}
                        >
                            {skill.name}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="resume-editor-chip-remove"
                            aria-label={`Remove ${skill.name}`}
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
            <p style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                Tip: Click on a skill's text to hide it from your resume without deleting it.
            </p>
        </div>
    );
}

export default SkillsEditor;
