import SignUpForm from "../components/auth/SignUpForm";
import "../styles/Auth.css";

function SignUp() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-200 sm:p-10">
                <SignUpForm />
            </section>
        </main>
    );
}

export default SignUp