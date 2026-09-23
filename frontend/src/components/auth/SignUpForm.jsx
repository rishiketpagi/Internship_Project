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
        <form className="w-full max-w-[28rem] grid gap-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <p className="text-indigo-600 text-xs font-extrabold tracking-[0.18em] uppercase">ResumeAI</p>
                <h1 className="m-0 text-slate-900 text-3xl leading-tight">Create your account</h1>
                <p className="m-0 text-gray-500">Create an account to save and manage your resumes.</p>
            </div>

            <div className="grid gap-4">
                <label className="grid gap-2 text-gray-700 text-sm font-semibold">
                    <span>Full Name</span>
                    <input
                        className="w-full box-border px-3.5 py-3 border border-gray-300 rounded-md text-slate-900 outline-none transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        placeholder="Your name"
                        required
                    />
                </label>

                <label className="grid gap-2 text-gray-700 text-sm font-semibold">
                    <span>Email</span>
                    <input
                        className="w-full box-border px-3.5 py-3 border border-gray-300 rounded-md text-slate-900 outline-none transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                    />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-gray-700 text-sm font-semibold">
                        <span>Password</span>
                        <input
                            className="w-full box-border px-3.5 py-3 border border-gray-300 rounded-md text-slate-900 outline-none transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            minLength={6}
                            required
                        />
                    </label>

                    <label className="grid gap-2 text-gray-700 text-sm font-semibold">
                        <span>Confirm Password</span>
                        <input
                            className="w-full box-border px-3.5 py-3 border border-gray-300 rounded-md text-slate-900 outline-none transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

            {error && <p className="px-3.5 py-3 border border-red-200 rounded-md bg-red-50 text-red-600 text-sm" role="alert">{error}</p>}

            <button className="min-h-[46px] px-4 py-3 rounded-md font-bold cursor-pointer transition-all duration-150 border-0 bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting || googleSubmitting}>
                {submitting ? "Creating account..." : "Create Account"}
            </button>

            <div className="flex items-center gap-3 text-slate-400 text-xs uppercase before:content-[''] before:h-px before:flex-1 before:bg-slate-200 after:content-[''] after:h-px after:flex-1 after:bg-slate-200"><span>or</span></div>

            <button className="min-h-[46px] px-4 py-3 rounded-md font-bold cursor-pointer transition-all duration-150 border border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={handleGoogleSignIn} disabled={submitting || googleSubmitting}>
                {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <p className="text-center text-sm">
                Already have an account? <Link to="/signin" className="text-indigo-600 font-bold hover:text-indigo-800">Sign In</Link>
            </p>
        </form>
    );
}
