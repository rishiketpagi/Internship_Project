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
            <div className="space-y-2">
                <p className="auth-eyebrow">ResumeAI</p>
                <h1>Create your account</h1>
                <p>Create an account to save and manage your resumes.</p>
            </div>

            <div className="auth-fields">
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

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="auth-field">
                    <span>Password</span>
                    <input
                        className="auth-input"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        minLength={6}
                        required
                    />
                </label>

                <label className="auth-field">
                    <span>Confirm Password</span>
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
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="auth-primary-button" type="submit" disabled={submitting || googleSubmitting}>
                {submitting ? "Creating account..." : "Create Account"}
            </button>

            <div className="auth-divider"><span>or</span></div>

            <button className="auth-google-button" type="button" onClick={handleGoogleSignIn} disabled={submitting || googleSubmitting}>
                {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <p className="auth-footer">
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </form>
    );
}
