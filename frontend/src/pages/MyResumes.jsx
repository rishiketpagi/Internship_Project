import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import DownloadResumeDialog from "../components/dashboard/DownloadResumeDialog";
import ResumeCard from "../components/dashboard/ResumeCard";
import {
    deleteResume,
    duplicateResume,
    getResumes,
    renameResume,
} from "../services/resumeService";
import "../styles/MyResumes.css";

export default function MyResumes() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [downloadResume, setDownloadResume] = useState(null);

    useEffect(() => {
        let active = true;

        async function loadResumes() {
            try {
                const savedResumes = await getResumes(user.uid);
                if (active) setResumes(savedResumes);
            } catch (loadError) {
                console.error("Failed to load resumes:", loadError);
                if (active) setError("Unable to load your saved resumes.");
            } finally {
                if (active) setLoading(false);
            }
        }

        loadResumes();

        return () => {
            active = false;
        };
    }, [user.uid]);

    const handleEdit = (resume) => {
        navigate(`/editor?template=${resume.templateId || "modern"}`, {
            state: {
                savedResume: resume,
            },
        });
    };

    const handleDelete = async (resumeId) => {
        if (!window.confirm("Are you sure you want to delete this resume?\nThis action cannot be undone.")) {
            return;
        }

        try {
            await deleteResume(user.uid, resumeId);
            setResumes((currentResumes) =>
                currentResumes.filter((resume) => resume.resumeId !== resumeId)
            );
        } catch (deleteError) {
            console.error("Failed to delete resume:", deleteError);
            setError("Unable to delete this resume.");
        }
    };

    const handleDuplicate = async (resume) => {
        try {
            const resumeId = await duplicateResume(user.uid, resume);
            setResumes((currentResumes) => [
                {
                    ...resume,
                    resumeId,
                    title: `Copy of ${resume.title || "Untitled Resume"}`,
                    createdAt: null,
                    updatedAt: null,
                },
                ...currentResumes,
            ]);
        } catch (duplicateError) {
            console.error("Failed to duplicate resume:", duplicateError);
            setError("Unable to duplicate this resume.");
        }
    };

    const handleDownload = (resume, format) => {
        navigate(`/editor?template=${resume.templateId || "modern"}`, {
            state: {
                savedResume: resume,
                downloadFormat: format,
            },
        });
        setDownloadResume(null);
    };

    const startRename = (resume) => {
        setEditingId(resume.resumeId);
        setEditingTitle(resume.title || "Resume");
    };

    const handleRename = async (resumeId) => {
        const title = editingTitle.trim();
        if (!title) return;

        try {
            await renameResume(user.uid, resumeId, title);
            setResumes((currentResumes) =>
                currentResumes.map((resume) =>
                    resume.resumeId === resumeId ? { ...resume, title } : resume
                )
            );
            setEditingId(null);
        } catch (renameError) {
            console.error("Failed to rename resume:", renameError);
            setError("Unable to rename this resume.");
        }
    };

    if (loading) {
        return (
            <main className="my-resumes-page">
                <p className="my-resumes-status">Loading your resumes...</p>
            </main>
        );
    }

    return (
        <main className="my-resumes-page">
            <div className="my-resumes-container">
                <header className="my-resumes-header">
                    <div>
                        <h1>My Resumes</h1>
                        <p>View and manage your saved resumes.</p>
                    </div>
                    <Link to="/create" className="my-resumes-create-button">
                        + Create New Resume
                    </Link>
                </header>

                {error && <p className="my-resumes-error" role="alert">{error}</p>}

                {resumes.length === 0 ? (
                    <section className="my-resumes-empty">
                        <h2>You don't have any saved resumes yet.</h2>
                        <p>Create your first resume and save it here.</p>
                        <Link to="/create" className="my-resumes-empty-button">
                            Create New Resume
                        </Link>
                    </section>
                ) : (
                    <section className="my-resumes-grid" aria-label="Saved resumes">
                        {resumes.map((resume) => (
                            <ResumeCard
                                key={resume.resumeId}
                                resume={resume}
                                isEditing={editingId === resume.resumeId}
                                editingTitle={editingTitle}
                                onEditingTitleChange={setEditingTitle}
                                onSaveTitle={() => handleRename(resume.resumeId)}
                                onStartRename={() => startRename(resume)}
                                onEdit={() => handleEdit(resume)}
                                onDownload={() => setDownloadResume(resume)}
                                onDuplicate={() => handleDuplicate(resume)}
                                onDelete={() => handleDelete(resume.resumeId)}
                            />
                        ))}
                    </section>
                )}
            </div>

            {downloadResume && (
                <DownloadResumeDialog
                    resume={downloadResume}
                    onDownload={(format) => handleDownload(downloadResume, format)}
                    onClose={() => setDownloadResume(null)}
                />
            )}
        </main>
    );
}