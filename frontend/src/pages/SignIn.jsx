import SignInForm from "../components/auth/SignInForm";
import "../styles/Auth.css";

function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-slate-200 sm:p-10">
        <SignInForm />
      </section>
    </main>
  );
}

export default SignIn