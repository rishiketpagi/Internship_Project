import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import DeleteConfirmDialog from "../components/dashboard/DeleteConfirmDialog";
import DownloadResumeDialog from "../components/dashboard/DownloadResumeDialog";
import ResumeCard from "../components/dashboard/ResumeCard";
import {
    deleteResume,
    duplicateResume,
    getResumes,
    renameResume,
} from "../services/resumeService";
import "../styles/MyResumes.css";

function SkeletonCard() {
    return (
        <div className="my-resume-card my-resume-skeleton" aria-hidden="true">
            <div className="my-resume-accent-bar skeleton-bar" />
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-meta">
                <div className="skeleton-line skeleton-badge" />
                <div className="skeleton-line skeleton-date" />
            </div>
            <div className="skeleton-actions">
                <div className="skeleton-line skeleton-btn" />
                <div className="skeleton-line skeleton-btn" />
                <div className="skeleton-line skeleton-btn" />
                <div className="skeleton-line skeleton-btn" />
            </div>
        </div>
    );
}

export default function MyResumes() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [downloadResume, setDownloadResume] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);   // resume to confirm-delete

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
            state: { savedResume: resume },
        });
    };

    const handlePreview = (resume) => {
        navigate(`/resume-preview?template=${resume.templateId || "modern"}`, {
            state: { savedResume: resume },
        });
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const { resumeId } = deleteTarget;

        try {
            await deleteResume(user.uid, resumeId);
            setResumes((current) => current.filter((r) => r.resumeId !== resumeId));
        } catch (deleteError) {
            console.error("Failed to delete resume:", deleteError);
            setError("Unable to delete this resume.");
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleDuplicate = async (resume) => {
        try {
            const resumeId = await duplicateResume(user.uid, resume);
            setResumes((current) => [
                {
                    ...resume,
                    resumeId,
                    title: `Copy of ${resume.title || "Untitled Resume"}`,
                    createdAt: null,
                    updatedAt: null,
                },
                ...current,
            ]);
        } catch (duplicateError) {
            console.error("Failed to duplicate resume:", duplicateError);
            setError("Unable to duplicate this resume.");
        }
    };

    const handleDownload = (resume, format) => {
        navigate(`/editor?template=${resume.templateId || "modern"}`, {
            state: { savedResume: resume, downloadFormat: format },
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
            setResumes((current) =>
                current.map((r) => (r.resumeId === resumeId ? { ...r, title } : r))
            );
            setEditingId(null);
        } catch (renameError) {
            console.error("Failed to rename resume:", renameError);
            setError("Unable to rename this resume.");
        }
    };

    return (
        <main className="my-resumes-page">
            <div className="my-resumes-container">
                <header className="my-resumes-header">
                    <div>
                        <h1>
                            My Resumes
                        </h1>
                        <p>View and manage your saved resumes.</p>
                    </div>
                    <Link to="/create" className="my-resumes-create-button" id="create-resume-btn" aria-label="Create new resume">
                        +<span className="create-btn-text">&nbsp;Create New Resume</span>
                    </Link>
                </header>

                {error && <p className="my-resumes-error" role="alert">{error}</p>}

                {loading ? (
                    <section className="my-resumes-grid" aria-label="Loading resumes">
                        {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
                    </section>
                ) : resumes.length === 0 ? (
                    <section className="my-resumes-empty">
                        <span className="my-resumes-empty-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                fill="none" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </span>
                        <h2>No saved resumes yet</h2>
                        <p>Create your first resume and it will appear here.</p>
                        <Link to="/create" className="my-resumes-empty-button" id="create-resume-empty-btn">
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
                                onPreview={() => handlePreview(resume)}
                                onEdit={() => handleEdit(resume)}
                                onDownload={() => setDownloadResume(resume)}
                                onDuplicate={() => handleDuplicate(resume)}
                                onDelete={() => setDeleteTarget(resume)}
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

            {deleteTarget && (
                <DeleteConfirmDialog
                    resumeTitle={deleteTarget.title}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </main>
    );
}