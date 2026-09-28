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

export default function ProjectsEditor({ value = [], onChange = () => {}, globalSkills = [], onGlobalSkillsChange = () => {} }) {
    const [drafts, setDrafts] = useState(() => value.map((p) => ({ ...p })));
    const [newFlags, setNewFlags] = useState(() => value.map(() => false));
    const [githubUrl, setGithubUrl] = useState("");
    const [fetchingProject, setFetchingProject] = useState(false);
    const [detectedSkills, setDetectedSkills] = useState([]);
    const [addedSkills, setAddedSkills] = useState([]);

    const updateDraft = (index, field, val) => {
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...d, [field]: val } : d));
    };

    const handleFetchGithub = async () => {
        if (!githubUrl) return;
        setFetchingProject(true);
        setDetectedSkills([]);
        setAddedSkills([]);
        
        try {
            const res = await fetch("http://localhost:5000/api/resumes/analyze-github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubUrl }),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                const fetchedTech = data.project.technologies || [];
                const newProj = {
                    name: data.project.name,
                    description: data.project.description || "",
                    technologies: fetchedTech,
                    url: data.project.url,
                    startDate: "",
                    endDate: "",
                    isHidden: false
                };
                
                onChange([...value, newProj]);
                setDrafts((prev) => [...prev, { ...newProj }]);
                setNewFlags((f) => [...f, true]);
                setGithubUrl("");
                
                // Identify new skills
                const currentSkillNames = globalSkills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase());
                const newSkills = fetchedTech.filter(tech => !currentSkillNames.includes(tech.toLowerCase()));
                if (newSkills.length > 0) {
                    setDetectedSkills(newSkills);
                }
            } else {
                alert(data.message || "Repository not found or invalid.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to analyze project with AI. Please try again.");
        } finally {
            setFetchingProject(false);
        }
    };

    const handleAddSkill = (skill) => {
        onGlobalSkillsChange([...globalSkills, { name: skill, isHidden: false }]);
        setAddedSkills([...addedSkills, skill]);
        // Remove it from detectedSkills after 2 seconds to keep it visible but green temporarily
        setTimeout(() => {
            setDetectedSkills(prev => prev.filter(s => s !== skill));
            setAddedSkills(prev => prev.filter(s => s !== skill));
        }, 2000);
    };

    const handleDismissSkill = (skill) => {
        setDetectedSkills(prev => prev.filter(s => s !== skill));
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

    const handleToggleHide = (index) => {
        const isHidden = !value[index].isHidden;
        onChange(value.map((e, i) => i === index ? { ...e, isHidden } : e));
        setDrafts((prev) => prev.map((d, i) => i === index ? { ...d, isHidden } : d));
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
                    isHidden={project.isHidden}
                    onToggleHide={() => handleToggleHide(index)}
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

            <div style={{ marginTop: '1rem', padding: '1.25rem', border: '1px solid var(--clr-border3)', borderRadius: 'var(--radius-sm)', background: 'var(--clr-bg)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--clr-text)', margin: '0 0 0.25rem 0' }}>Have projects on GitHub?</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--clr-muted)', margin: 0 }}>Paste your repository URL and we'll fetch the details for you.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        type="url" 
                        placeholder="github.com/username/repo" 
                        value={githubUrl}
                        onChange={e => setGithubUrl(e.target.value)}
                        className="resume-editor-input"
                        style={{ flexGrow: 1, margin: 0 }}
                    />
                    <button 
                        type="button"
                        onClick={handleFetchGithub}
                        disabled={fetchingProject}
                        style={{ padding: '0 1rem', background: 'var(--clr-text)', color: 'var(--clr-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: fetchingProject ? 'not-allowed' : 'pointer', opacity: fetchingProject ? 0.7 : 1, transition: 'all 0.2s' }}
                    >
                        {fetchingProject ? "Fetching..." : "Fetch Project"}
                    </button>
                </div>
                {detectedSkills.length > 0 && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--clr-bg-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--clr-border2)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--clr-text)', marginBottom: '0.5rem', marginTop: 0 }}>New Skills Detected:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {detectedSkills.map(skill => {
                                const isAdded = addedSkills.includes(skill);
                                return (
                                    <div key={skill} style={{ display: 'flex', alignItems: 'center', background: isAdded ? 'var(--clr-success)' : 'var(--clr-bg)', color: isAdded ? 'white' : 'var(--clr-text)', border: isAdded ? '1px solid var(--clr-success)' : '1px solid var(--clr-border3)', borderRadius: '1rem', padding: '0.2rem 0.5rem', fontSize: '0.75rem', transition: 'all 0.3s' }}>
                                        <span style={{ marginRight: '0.5rem' }}>{skill}</span>
                                        {!isAdded && (
                                            <>
                                                <button onClick={() => handleAddSkill(skill)} style={{ background: 'none', border: 'none', color: 'var(--clr-primary)', cursor: 'pointer', padding: '0 0.2rem', fontWeight: 'bold' }}>+</button>
                                                <button onClick={() => handleDismissSkill(skill)} style={{ background: 'none', border: 'none', color: 'var(--clr-danger)', cursor: 'pointer', padding: '0 0.2rem', fontWeight: 'bold' }}>×</button>
                                            </>
                                        )}
                                        {isAdded && <span style={{ padding: '0 0.2rem', fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', margin: '0.25rem 0' }}>
                    <div style={{ flexGrow: 1, borderTop: '1px solid var(--clr-border3)' }}></div>
                    <span style={{ padding: '0 0.75rem', fontSize: '0.65rem', color: 'var(--clr-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>OR</span>
                    <div style={{ flexGrow: 1, borderTop: '1px solid var(--clr-border3)' }}></div>
                </div>
                <button type="button" onClick={handleAdd} className="resume-editor-add-button" style={{ marginTop: 0 }}>
                    + Add Project Manually
                </button>
            </div>
        </div>
    );
}
