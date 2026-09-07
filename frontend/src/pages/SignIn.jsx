import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/ToastContainer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import "../styles/Auth.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { error: showError, success } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      // TODO: Integrate with Firebase Auth
      // For now, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));

      success("Welcome back!", "You have been signed in successfully.");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      showError("Sign In Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth__container">
        <Card className="auth__card" variant="elevated" padding="xl">
          <div className="auth__header">
            <div className="auth__logo" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
                <path d="M8 12h16M8 16h12M8 20h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="auth__title">Welcome Back</h1>
            <p className="auth__subtitle">Sign in to continue to ResumeGen</p>
          </div>

          <form onSubmit={handleSubmit} className="auth__form" noValidate>
            {error && (
              <div className="auth__error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="auth__field-group">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                }
                className="auth__input"
              />
            </div>

            <div className="auth__field-group">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                className="auth__input"
              />
            </div>

            <div className="auth__forgot">
              <Link to="/forgot-password" className="auth__forgot-link">Forgot password?</Link>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              className="auth__submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="auth__footer">
            <p className="auth__footer-text">
              Don't have an account? <Link to="/signup" className="auth__footer-link">Sign up</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;