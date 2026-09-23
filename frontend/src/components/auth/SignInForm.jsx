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
        <form className="w-full max-w-[28rem] grid gap-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <p className="text-indigo-600 text-xs font-extrabold tracking-[0.18em] uppercase">ResumeAI</p>
                <h1 className="m-0 text-slate-900 text-3xl leading-tight">Welcome back</h1>
                <p className="m-0 text-gray-500">Sign in to save and manage your resumes.</p>
            </div>

            <div className="grid gap-4">
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

                <label className="grid gap-2 text-gray-700 text-sm font-semibold">
                    <span>Password</span>
                    <input
                        className="w-full box-border px-3.5 py-3 border border-gray-300 rounded-md text-slate-900 outline-none transition-all duration-150 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                    />
                </label>
            </div>

            {error && <p className="px-3.5 py-3 border border-red-200 rounded-md bg-red-50 text-red-600 text-sm" role="alert">{error}</p>}

            <button className="min-h-[46px] px-4 py-3 rounded-md font-bold cursor-pointer transition-all duration-150 border-0 bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting || googleSubmitting}>
                {submitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex items-center gap-3 text-slate-400 text-xs uppercase before:content-[''] before:h-px before:flex-1 before:bg-slate-200 after:content-[''] after:h-px after:flex-1 after:bg-slate-200"><span>or</span></div>

            <button className="min-h-[46px] px-4 py-3 rounded-md font-bold cursor-pointer transition-all duration-150 border border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={handleGoogleSignIn} disabled={submitting || googleSubmitting}>
                {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <p className="text-center text-sm">
                Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-800">Create Account</Link>
            </p>
        </form>
    );
}
