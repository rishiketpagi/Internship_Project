import SignUpForm from "../components/auth/SignUpForm";
import "../styles/Auth.css";

function SignUp() {
    return (
        <main className="auth-page">
            <section className="auth-card">
                <SignUpForm />
            </section>
        </main>
    );
}

export default SignUp;