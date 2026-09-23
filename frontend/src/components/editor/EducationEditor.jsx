import { useState } from "react";
import EditableCard from "./EditableCard";

const EMPTY = {
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    grade: "",
};

const FIELDS = [
    ["institution", "Institution"],
    ["degree", "Degree"],
    ["field", "Field of Study"],
    ["startDate", "Start Date"],
    ["endDate", "End Date"],
    ["grade", "Grade / GPA"],
];

function summary(entry) {
    const title = entry.institution || "New Education Entry";
    const degree = [entry.degree, entry.field && `in ${entry.field}`].filter(Boolean).join(" ");
    const dates = entry.startDate && entry.endDate
        ? `${entry.startDate} – ${entry.endDate}`
        : (entry.startDate || entry.endDate || "");
    const sub = [degree, dates, entry.grade && `Grade: ${entry.grade}`].filter(Boolean).join(" · ");
    return (
        <div>
            <p className="editable-card-title">{title}</p>
            {sub && <p className="editable-card-sub">{sub}</p>}
        </div>
    );
}

export default function EducationEditor({ value = [], onChange = () => { } }) {
    // drafts hold per-entry local edits until the user hits Save
    const [drafts, setDrafts] = useState(() => value.map((e) => ({ ...e })));
    const [newFlags, setNewFlags] = useState(() => value.map(() => false));

    const updateDraft = (index, field, val) => {
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...d, [field]: val } : d));
    };

    const handleSave = (index) => {
        onChange(value.map((e, i) => i === index ? { ...drafts[i] } : e));
        setNewFlags((f) => f.map((v, i) => i === index ? false : v));
    };

    const handleCancel = (index) => {
        // revert draft to committed value
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...value[i] } : d));
        if (newFlags[index]) {
            // was a newly added entry that was never saved — remove it
            onChange(value.filter((_, i) => i !== index));
            setDrafts((prev) => prev.filter((_, i) => i !== index));
            setNewFlags((f) => f.filter((_, i) => i !== index));
        }
    };

    const handleDelete = (index) => {
        onChange(value.filter((_, i) => i !== index));
        setDrafts((prev) => prev.filter((_, i) => i !== index));
        setNewFlags((f) => f.filter((_, i) => i !== index));
    };

    const handleAdd = () => {
        const blank = { ...EMPTY };
        onChange([...value, blank]);
        setDrafts((prev) => [...prev, { ...blank }]);
        setNewFlags((f) => [...f, true]);
    };

    return (
        <div className="resume-editor-education-list">
            {value.map((entry, index) => (
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
                + Add Education
            </button>
        </div>
    );
}
