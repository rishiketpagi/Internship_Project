import { useState } from "react";

function AchievementsEditor({ value = [], onChange = () => { } }) {
    const [draft, setDraft] = useState("");

    const addAchievement = () => {
        const trimmedAchievement = draft.trim();
        if (!trimmedAchievement) {
            return;
        }

        onChange([...value, trimmedAchievement]);
        setDraft("");
    };

    const updateAchievement = (index, nextValue) => {
        onChange(value.map((achievement, achievementIndex) => achievementIndex === index ? nextValue : achievement));
    };

    return (
        <div className="resume-editor-simple-list">
            {value.map((achievement, index) => (
                <div key={index} className="resume-editor-simple-row">
                    <textarea
                        value={achievement || ""}
                        onChange={(event) => updateAchievement(index, event.target.value)}
                        placeholder="Describe your achievement or award"
                        className="resume-editor-textarea"
                        rows={3}
                    />
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((_, achievementIndex) => achievementIndex !== index))}
                        className="resume-editor-delete-button"
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div className="resume-editor-simple-row">
                <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="New achievement"
                    className="resume-editor-textarea"
                    rows={3}
                />
                <button
                    type="button"
                    onClick={addAchievement}
                    className="resume-editor-add-button"
                >
                    + Add Achievement
                </button>
            </div>
        </div>
    );
}

export default AchievementsEditor;