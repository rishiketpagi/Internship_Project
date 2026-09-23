import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreateResume from "./pages/CreateResume";
import Templates from "./pages/Templates";
import ResumeEditor from "./pages/ResumeEditor";
import ResumePreview from "./pages/ResumePreview";
import ATSAnalysis from "./pages/ATSAnalysis";
import MyResumes from "./pages/MyResumes";
import { ProtectedRoute } from "./components/auth/AuthRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-resumes"
          element={
            <ProtectedRoute>
              <MyResumes />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<CreateResume />} />
        <Route path="/create-resume" element={<CreateResume />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/editor" element={<ResumeEditor />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
        <Route path="/ats-analysis" element={<ATSAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;