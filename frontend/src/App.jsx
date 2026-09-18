import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CreateResume from "./pages/CreateResume";
import Templates from "./pages/Templates";
import ResumeEditor from "./pages/ResumeEditor";
import ResumeEditorV2 from "./pages/ResumeEditorV2";
import MyResumes from "./pages/MyResumes";
import { ProtectedRoute } from "./components/auth/AuthRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/editor-v2" element={<ResumeEditorV2 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;