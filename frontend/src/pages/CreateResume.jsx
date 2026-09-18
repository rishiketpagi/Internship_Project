import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeTextInput from "../components/input/TextInput";
import ResumeFileUpload from "../components/input/FileUpload";
import "../styles/CreateResume.css";
import { roles } from "../data/roles";
import { apiUrl } from "../config/api";

function DataInput() {
    const navigate = useNavigate();
    const [rawText, setRawText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [targetRole, setTargetRole] = useState(roles[0]);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!targetRole) {
            setError("Please select a target role.");
            return;
        }

        if (!selectedFile && !rawText.trim()) {
            setError("Please upload a resume file or paste your resume text.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            let response;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("resume", selectedFile);
                formData.append("targetRole", targetRole);
                if (jobDescription.trim()) {
                    formData.append("jobDescription", jobDescription.trim());
                }

                response = await fetch(apiUrl("/extract-resume"), {
                    method: "POST",
                    body: formData,
                });
            } else {
                response = await fetch(apiUrl("/extract-resume"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: rawText,
                        targetRole,
                        jobDescription: jobDescription.trim() ? jobDescription.trim() : undefined,
                    }),
                });
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            navigate("/templates", {
                state: {
                    roleResumeData: data.roleResumeData,
                },
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="data-input-container">
            <h1>Create Resume</h1>

            <label className="input-label">
                <span>Target Role</span>
                <select
                    value={targetRole}
                    onChange={(event) => setTargetRole(event.target.value)}
                >
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </label>

            <label className="input-label">
                <span>Job Description (Optional)</span>
                <textarea
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    placeholder="Paste the job description here..."
                    rows={4}
                />
            </label>

            <label className="input-label">
                <span>Your Existing Resume</span>
                <ResumeFileUpload
                    file={selectedFile}
                    onFileChange={setSelectedFile}
                />
            </label>

            <div className="divider">
                <hr />
                <p>OR</p>
            </div>

            <label className="input-label">
                <span>Paste Resume Text</span>
                <ResumeTextInput
                    value={rawText}
                    onChange={setRawText}
                />
            </label>

            <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading || (!selectedFile && !rawText.trim())}
            >
                {loading ? "Generating..." : "Generate Resume"}
            </button>

            {loading && <p className="status-loading">Sending your information...</p>}
            {error && <p className="status-error">{error}</p>}
        </div>
    );
}

export default DataInput;