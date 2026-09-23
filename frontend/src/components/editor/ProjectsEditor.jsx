import { useState } from "react";
import EditableCard from "./EditableCard";

const EMPTY = {
    name: "",
    description: "",
    technologies: [],
    url: "",
    startDate: "",
    endDate: "",
};

const TEXT_FIELDS = [
    ["name", "Project Name", "text"],
    ["url", "Project URL", "url"],
    ["startDate", "Start Date", "text"],
    ["endDate", "End Date", "text"],
];

function summary(project) {
    const title = project.name || "New Project";
    const tech = project.technologies?.join(", ");
    const dates = project.startDate && project.endDate
        ? `${project.startDate} – ${project.endDate}`
        : (project.startDate || project.endDate || "");
    const sub = [tech, dates].filter(Boolean).join(" · ");
    return (
        <div>
            <p className="editable-card-title">{title}</p>
            {sub && <p className="editable-card-sub">{sub}</p>}
        </div>
    );
}

export default function ProjectsEditor({ value = [], onChange = () => { } }) {
    const [drafts, setDrafts] = useState(() => value.map((p) => ({ ...p })));
    const [newFlags, setNewFlags] = useState(() => value.map(() => false));

    const updateDraft = (index, field, val) => {
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...d, [field]: val } : d));
    };

    const handleSave = (index) => {
        onChange(value.map((e, i) => i === index ? { ...drafts[i] } : e));
        setNewFlags((f) => f.map((v, i) => i === index ? false : v));
    };

    const handleCancel = (index) => {
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...value[i] } : d));
        if (newFlags[index]) {
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
            {value.map((project, index) => (
                <EditableCard
                    key={index}
                    summary={summary(project)}
                    onDelete={() => handleDelete(index)}
                    onSave={() => handleSave(index)}
                    onCancel={() => handleCancel(index)}
                    openOnMount={newFlags[index] || false}
                >
                    <div className="resume-editor-fields">
                        {TEXT_FIELDS.map(([field, label, type]) => (
                            <label key={field} className="resume-editor-field">
                                <span className="resume-editor-label">{label}</span>
                                <input
                                    type={type}
                                    value={drafts[index]?.[field] || ""}
                                    onChange={(e) => updateDraft(index, field, e.target.value)}
                                    className="resume-editor-input"
                                />
                            </label>
                        ))}
                        <label className="resume-editor-field">
                            <span className="resume-editor-label">Description</span>
                            <textarea
                                value={drafts[index]?.description || ""}
                                onChange={(e) => updateDraft(index, "description", e.target.value)}
                                className="resume-editor-textarea resume-editor-project-description"
                                rows={4}
                            />
                        </label>
                        <label className="resume-editor-field">
                            <span className="resume-editor-label">Technologies (comma-separated)</span>
                            <input
                                type="text"
                                value={drafts[index]?.technologies?.join(", ") || ""}
                                onChange={(e) =>
                                    updateDraft(index, "technologies",
                                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                                    )
                                }
                                className="resume-editor-input"
                            />
                        </label>
                    </div>
                </EditableCard>
            ))}

            <button type="button" onClick={handleAdd} className="resume-editor-add-button">
                + Add Project
            </button>
        </div>
    );
}
