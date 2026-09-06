import { useState } from "react";

function CertificationsEditor({ value = [], onChange = () => { } }) {
    const [draft, setDraft] = useState("");

    const addCertification = () => {
        const trimmed = draft.trim();
        if (!trimmed) {
            return;
        }

        onChange([...value, trimmed]);
        setDraft("");
    };

    const updateCertification = (index, nextValue) => {
        onChange(value.map((certification, certificationIndex) =>
            certificationIndex === index ? nextValue : certification
        ));
    };

    return (
        <div className="resume-editor-skills-list">
            {value.map((certification, index) => (
                <div key={index} className="resume-editor-skill-row">
                    <input
                        type="text"
                        value={certification}
                        onChange={(event) => updateCertification(index, event.target.value)}
                        placeholder="Certification name"
                        className="resume-editor-input"
                    />
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((_, certificationIndex) => certificationIndex !== index))}
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
                    placeholder="New certification"
                    className="resume-editor-input"
                />
                <button
                    type="button"
                    onClick={addCertification}
                    className="resume-editor-add-button"
                >
                    + Add Certification
                </button>
            </div>
        </div>
    );
}

export default CertificationsEditor;
