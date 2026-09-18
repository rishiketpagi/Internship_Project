import { useState } from "react";

const EMPTY_CERT = {
    name: "",
    issuer: "",
    date: "",
    url: "",
};

function toObject(value) {
    if (!value) return { ...EMPTY_CERT };
    if (typeof value === "string") return { ...EMPTY_CERT, name: value };
    return { ...EMPTY_CERT, ...value };
}

function CertificationsEditor({ value = [], onChange = () => {} }) {
    const [draft, setDraft] = useState({ ...EMPTY_CERT });

    const addCertification = () => {
        const name = draft.name.trim();
        if (!name) return;
        const cert = {
            name,
            issuer: draft.issuer.trim(),
            date: draft.date.trim(),
            url: draft.url.trim(),
        };
        onChange([...value, cert]);
        setDraft({ ...EMPTY_CERT });
    };

    const updateCertification = (index, next) => {
        onChange(
            value.map((cert, certIndex) =>
                certIndex === index ? toObject(next) : cert
            )
        );
    };

    const removeCertification = (index) => {
        onChange(value.filter((_, certIndex) => certIndex !== index));
    };

    const updateDraft = (field, fieldValue) => {
        setDraft((current) => ({ ...current, [field]: fieldValue }));
    };

    return (
        <div className="resume-editor-education-list">
            {value.map((cert, index) => {
                const certObj = toObject(cert);
                return (
                    <div
                        key={index}
                        className="resume-editor-education-card"
                    >
                        <div className="resume-editor-fields">
                            {[
                                ["name", "Name", "text"],
                                ["issuer", "Issuer", "text"],
                                ["date", "Date", "text"],
                                ["url", "URL", "url"],
                            ].map(([field, label, type]) => (
                                <label
                                    key={field}
                                    className="resume-editor-field"
                                >
                                    <span className="resume-editor-label">
                                        {label}
                                    </span>
                                    <input
                                        type={type}
                                        value={certObj[field] || ""}
                                        onChange={(event) =>
                                            updateCertification(
                                                index,
                                                { ...certObj, [field]: event.target.value }
                                            )
                                        }
                                        className="resume-editor-input"
                                    />
                                </label>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="resume-editor-delete-button"
                        >
                            Remove
                        </button>
                    </div>
                );
            })}

            <div className="resume-editor-education-card">
                <div className="resume-editor-fields">
                    {[
                        ["name", "Name", "text"],
                        ["issuer", "Issuer", "text"],
                        ["date", "Date", "text"],
                        ["url", "URL", "url"],
                    ].map(([field, label, type]) => (
                        <label
                            key={field}
                            className="resume-editor-field"
                        >
                            <span className="resume-editor-label">
                                {label}
                            </span>
                            <input
                                type={type}
                                value={draft[field] || ""}
                                onChange={(event) =>
                                    updateDraft(field, event.target.value)
                                }
                                className="resume-editor-input"
                                placeholder={
                                    field === "name" ? "Certification name" : ""
                                }
                            />
                        </label>
                    ))}
                </div>
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
