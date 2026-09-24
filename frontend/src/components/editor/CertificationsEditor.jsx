import { useState } from "react";
import EditableCard from "./EditableCard";

const EMPTY = {
    name: "",
    issuer: "",
    date: "",
    url: "",
};

const FIELDS = [
    ["name", "Certification Name"],
    ["issuer", "Issuing Organization"],
    ["date", "Date Issued"],
    ["url", "Credential URL"],
];

function summary(entry) {
    const title = entry.name || "New Certification";
    const sub = [entry.issuer, entry.date].filter(Boolean).join(" · ");
    return (
        <div>
            <p className="editable-card-title">{title}</p>
            {sub && <p className="editable-card-sub">{sub}</p>}
        </div>
    );
}

export default function CertificationsEditor({ value = [], onChange = () => { } }) {
    // Handle legacy string arrays (just in case they exist from old data)
    const normalizedValue = value.map(v => typeof v === 'string' ? { ...EMPTY, name: v } : v);

    const [drafts, setDrafts] = useState(() => normalizedValue.map((e) => ({ ...e })));
    const [newFlags, setNewFlags] = useState(() => normalizedValue.map(() => false));

    const updateDraft = (index, field, val) => {
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...d, [field]: val } : d));
    };

    const handleSave = (index) => {
        onChange(normalizedValue.map((e, i) => i === index ? { ...drafts[i] } : e));
        setNewFlags((f) => f.map((v, i) => i === index ? false : v));
    };

    const handleCancel = (index) => {
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...normalizedValue[i] } : d));
        if (newFlags[index]) {
            onChange(normalizedValue.filter((_, i) => i !== index));
            setDrafts((prev) => prev.filter((_, i) => i !== index));
            setNewFlags((f) => f.filter((_, i) => i !== index));
        }
    };

    const handleDelete = (index) => {
        onChange(normalizedValue.filter((_, i) => i !== index));
        setDrafts((prev) => prev.filter((_, i) => i !== index));
        setNewFlags((f) => f.filter((_, i) => i !== index));
    };

    const handleAdd = () => {
        const blank = { ...EMPTY };
        onChange([...normalizedValue, blank]);
        setDrafts((prev) => [...prev, { ...blank }]);
        setNewFlags((f) => [...f, true]);
    };

    return (
        <div className="resume-editor-education-list">
            {normalizedValue.map((entry, index) => (
                <EditableCard
                    key={index}
                    summary={summary(entry)}
                    onDelete={() => handleDelete(index)}
                    onSave={() => handleSave(index)}
                    onCancel={() => handleCancel(index)}
                    openOnMount={newFlags[index] || false}
                >
                    <div className="resume-editor-fields">
                        {FIELDS.map(([field, label]) => (
                            <label key={field} className="resume-editor-field">
                                <span className="resume-editor-label">{label}</span>
                                <input
                                    type="text"
                                    value={drafts[index]?.[field] || ""}
                                    onChange={(e) => updateDraft(index, field, e.target.value)}
                                    className="resume-editor-input"
                                />
                            </label>
                        ))}
                    </div>
                </EditableCard>
            ))}

            <button type="button" onClick={handleAdd} className="resume-editor-add-button">
                + Add Certification
            </button>
        </div>
    );
}
