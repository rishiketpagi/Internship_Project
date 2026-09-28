import { useState } from "react";

function AchievementsEditor({ value = [], onChange = () => { } }) {
    const normalizedValue = value.map(v => typeof v === 'string' ? { name: v, isHidden: false } : v);
    const [draft, setDraft] = useState("");

    const addAchievement = () => {
        const trimmedAchievement = draft.trim();
        if (!trimmedAchievement) {
            return;
        }

        onChange([...normalizedValue, { name: trimmedAchievement, isHidden: false }]);
        setDraft("");
    };

    const updateAchievement = (index, nextValue) => {
        onChange(normalizedValue.map((achievement, achievementIndex) => 
            achievementIndex === index ? { ...achievement, name: nextValue } : achievement
        ));
    };

    const toggleHide = (index) => {
        onChange(normalizedValue.map((achievement, achievementIndex) => 
            achievementIndex === index ? { ...achievement, isHidden: !achievement.isHidden } : achievement
        ));
    };

    return (
        <div className="resume-editor-simple-list">
            {normalizedValue.map((achievement, index) => (
                <div key={index} className="resume-editor-simple-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <textarea
                            value={achievement.name || ""}
                            onChange={(event) => updateAchievement(index, event.target.value)}
                            placeholder="Describe your achievement or award"
                            className="resume-editor-textarea"
                            rows={2}
                            style={{ opacity: achievement.isHidden ? 0.6 : 1 }}
                        />
                        {achievement.isHidden && (
                            <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 'bold', marginTop: '0.2rem' }}>
                                HIDDEN FROM RESUME
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <button
                            type="button"
                            onClick={() => toggleHide(index)}
                            className="resume-editor-delete-button"
                            style={{ color: achievement.isHidden ? '#10b981' : '#64748b' }}
                        >
                            {achievement.isHidden ? "Show" : "Hide"}
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(normalizedValue.filter((_, achievementIndex) => achievementIndex !== index))}
                            className="resume-editor-delete-button"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <div className="resume-editor-simple-row">
                <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="New achievement"
                    className="resume-editor-textarea"
                    rows={2}
                />
                <button
                    type="button"
                    onClick={addAchievement}
                    className="resume-editor-add-button"
                    style={{ margin: 0, padding: '0 1rem' }}
                >
                    + Add
                </button>
            </div>
        </div>
    );
}

export default AchievementsEditor;