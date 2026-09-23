import SignInForm from "../components/auth/SignInForm";
import "../styles/Auth.css";

function SignIn() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <SignInForm />
      </section>
    </main>
  );
}

export default SignIn;