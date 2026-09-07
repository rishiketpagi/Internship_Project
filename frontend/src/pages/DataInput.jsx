import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeTextInput from "../components/input/TextInput";
import ResumeFileUpload from "../components/input/FileUpload";
import "../styles/DataInput.css";
import { roles } from "../data/roles";

function DataInput() {
    const navigate = useNavigate();
    const [rawText, setRawText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [targetRole, setTargetRole] = useState(roles[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTextContinue = async () => {
        if (!targetRole) {
            setError("Please select a target role.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await fetch("http://localhost:5000/extract-resume", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: rawText,
                    targetRole,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            navigate("/editor?template=modern", {
                state: {
                    resumeData: data.resumeData,
                },
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileContinue = async () => {
        if (!targetRole) {
            setError("Please select a target role.");
            return;
        }

        if (!selectedFile) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            const formData = new FormData();
            formData.append("resume", selectedFile);
            formData.append("targetRole", targetRole);

            const response = await fetch("http://localhost:5000/extract-resume", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            navigate("/editor?template=modern", {
                state: {
                    resumeData: data.resumeData,
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
            <h1>Create Your Resume</h1>
            <p>Provide your information using either method.</p>

            <label className="target-role">
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

            <ResumeTextInput
                value={rawText}
                onChange={setRawText}
                onContinue={handleTextContinue}
            />

            <div className="divider">
                <hr />
                <p>OR</p>
            </div>

            <ResumeFileUpload
                file={selectedFile}
                onFileChange={setSelectedFile}
                onContinue={handleFileContinue}
            />

            {loading && <p className="status-loading">Sending your information...</p>}

            {error && <p className="status-error">{error}</p>}

        </div>
    );
}

export default DataInput;