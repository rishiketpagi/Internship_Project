import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/ui/ToastContainer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Spinner from "../components/ui/Spinner";
import "../../styles/DataInput.css";

function DataInput() {
  const [rawText, setRawText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const { success, error: showError } = useToast();
  const fileInputRef = useRef(null);

  const handleTextContinue = async () => {
    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const response = await fetch("http://localhost:5000/extract-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: rawText,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResponse(data);
      success("Success!", "Resume information extracted successfully.");
    } catch (error) {
      setError(error.message);
      showError("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileContinue = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch("http://localhost:5000/extract-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResponse(data);
      success("Success!", "Resume information extracted successfully.");
    } catch (error) {
      setError(error.message);
      showError("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      showError("Invalid File", "Please upload a PDF or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("File Too Large", "File size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
  };

  return (
    <div className="data-input-page">
      <div className="container">
        <div className="data-input__header">
          <h1 className="data-input__title">Create Your Resume</h1>
          <p className="data-input__subtitle">
            Provide your information using either method below.
            We'll extract and structure your data automatically.
          </p>
        </div>

        <div className="data-input__methods">
          <Card className="data-input__method-card" variant="elevated" padding="lg">
            <div className="data-input__method-header">
              <div className="data-input__method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <h2 className="data-input__method-title">Enter Your Information</h2>
                <p className="data-input__method-description">
                  Tell us about your education, experience, projects, skills, certifications,
                  achievements, and anything else you want included in your resume.
                </p>
              </div>
            </div>

            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Example: I am a final year computer engineering student. I built a full-stack e-commerce application using React and Node.js. I have experience with AWS, Docker, and PostgreSQL. I led a team of 4 in a hackathon and won 2nd place..."
              rows={8}
              maxLength={5000}
              showCharCount
              helperText="Describe your background in natural language. The AI will extract structured data."
              className="data-input__textarea"
            />

            <div className="data-input__method-footer">
              <Button
                size="lg"
                fullWidth
                onClick={handleTextContinue}
                disabled={!rawText.trim() || loading}
                loading={loading}
                leftIcon={!loading && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              >
                {loading ? 'Processing...' : 'Continue with Text'}
              </Button>
            </div>
          </Card>

          <div className="data-input__divider" role="separator" aria-label="or">
            <span className="data-input__divider-text">OR</span>
          </div>

          <Card className="data-input__method-card" variant="elevated" padding="lg">
            <div className="data-input__method-header">
              <div className="data-input__method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div>
                <h2 className="data-input__method-title">Upload Your Resume</h2>
                <p className="data-input__method-description">
                  Upload your existing resume (PDF or DOCX) and we'll extract
                  the information from it.
                </p>
              </div>
            </div>

            <div className="data-input__file-dropzone" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="data-input__file-input"
                id="resume-upload"
                disabled={loading}
              />
              <label htmlFor="resume-upload" className="data-input__file-label">
                {selectedFile ? (
                  <>
                    <svg className="data-input__file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div className="data-input__file-info">
                      <p className="data-input__file-name">{selectedFile.name}</p>
                      <p className="data-input__file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      className="data-input__file-remove"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                      aria-label="Remove file"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="data-input__file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="data-input__file-prompt">Click to upload or drag and drop</p>
                    <p className="data-input__file-hint">PDF or DOCX, max 10MB</p>
                  </>
                )}
              </label>
            </div>

            {selectedFile && (
              <div className="data-input__method-footer">
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleFileContinue}
                  disabled={loading}
                  loading={loading}
                  leftIcon={!loading && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                >
                  {loading ? 'Processing...' : 'Continue with File'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {response && (
          <Card className="data-input__response-card" variant="outlined" padding="lg">
            <div className="data-input__response-header">
              <h2 className="data-input__response-title">Extracted Information</h2>
              <Link to="/profile" className="data-input__view-profile">
                View Profile
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="data-input__response-content">
              <pre className="data-input__response-json">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
            <div className="data-input__response-actions">
              <Link to="/input-resume">
                <Button variant="ghost" size="sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Start Over
                </Button>
              </Link>
              <Link to="/profile">
                <Button size="sm" leftIcon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }>
                  Continue to Profile
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DataInput;