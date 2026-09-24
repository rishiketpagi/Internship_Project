import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const firebaseMessages = {
    "auth/email-already-in-use": "An account already exists for this email.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/operation-not-allowed": "Email and password sign-up is not enabled in Firebase.",
};

function getAuthErrorMessage(error) {
    return firebaseMessages[error.code] || "Unable to create your account. Please try again.";
}

export default function SignUpForm() {
    const navigate = useNavigate();
    const { signUp, signInWithGoogle } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Complete all fields before creating your account.");
            return;
        }

        if (password.length < 6) {
            setError("Use a password with at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setSubmitting(true);
            await signUp(name, email.trim(), password);
            navigate("/", { replace: true });
        } catch (authError) {
            setError(getAuthErrorMessage(authError));
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        try {
            setGoogleSubmitting(true);
            await signInWithGoogle();
            navigate("/", { replace: true });
        } catch (authError) {
            setError(authError.code === "auth/popup-closed-by-user"
                ? "Google sign-in was cancelled."
                : "Unable to continue with Google. Please try again.");
        } finally {
            setGoogleSubmitting(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-header">
                <p className="auth-eyebrow">RoleResume</p>
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">Create an account to save and manage your resumes.</p>
            </div>

            <label className="auth-field">
                <span>Full Name</span>
                <input
                    className="auth-input"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="Your name"
                    required
                />
            </label>

            <label className="auth-field">
                <span>Email</span>
                <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                />
            </label>

            <div className="auth-row">
                <label className="auth-field">
                    <span>Password</span>
                    <input
                        className="auth-input"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        placeholder="At least 6 chars"
                        minLength={6}
                        required
                    />
                </label>

                <label className="auth-field">
                    <span>Confirm</span>
                    <input
                        className="auth-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        minLength={6}
                        required
                    />
                </label>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="auth-btn-primary" type="submit" disabled={submitting || googleSubmitting}>
                {submitting ? "Creating account..." : "Create Account"}
            </button>

            <div className="auth-divider"><span>or</span></div>

            <button className="auth-btn-google" type="button" onClick={handleGoogleSignIn} disabled={submitting || googleSubmitting}>
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <p className="auth-footer">
                Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
            </p>
        </form>
    );
}
