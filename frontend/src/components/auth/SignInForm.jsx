import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const firebaseMessages = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
};

function getAuthErrorMessage(error) {
    return firebaseMessages[error.code] || "Unable to sign in. Please try again.";
}

export default function SignInForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, signInWithGoogle } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Enter your email and password.");
            return;
        }

        try {
            setSubmitting(true);
            await signIn(email.trim(), password);
            const destination = location.state?.from?.pathname || "/";
            navigate(destination, { replace: true });
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
            const destination = location.state?.from?.pathname || "/";
            navigate(destination, { replace: true });
        } catch (authError) {
            setError(authError.code === "auth/popup-closed-by-user"
                ? "Google sign-in was cancelled."
                : "Unable to sign in with Google. Please try again.");
        } finally {
            setGoogleSubmitting(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <p className="auth-eyebrow">ResumeAI</p>
                <h1>Welcome back</h1>
                <p>Sign in to save and manage your resumes.</p>
            </div>

            <div className="auth-fields">
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

            <label className="auth-field">
                <span>Password</span>
                <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                />
            </label>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="auth-primary-button" type="submit" disabled={submitting || googleSubmitting}>
                {submitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-divider"><span>or</span></div>

            <button className="auth-google-button" type="button" onClick={handleGoogleSignIn} disabled={submitting || googleSubmitting}>
                {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <p className="auth-footer">
                Don't have an account? <Link to="/signup">Create Account</Link>
            </p>
        </form>
    );
}
