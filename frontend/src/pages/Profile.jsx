import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import PersonalInfoEditor from "../components/editor/PersonalInfoEditor";
import SummaryEditor from "../components/editor/SummaryEditor";
import EducationEditor from "../components/editor/EducationEditor";
import ExperienceEditor from "../components/editor/ExperienceEditor";
import ProjectsEditor from "../components/editor/ProjectsEditor";
import SkillsEditor from "../components/editor/SkillsEditor";
import CertificationsEditor from "../components/editor/CertificationsEditor";
import AchievementsEditor from "../components/editor/AchievementsEditor";
import { emptyProfile, getProfile, saveProfile } from "../services/profileService";
import "../styles/Profile.css";
import "../styles/ResumeEditor.css";

const sections = [
  ["personalInfo", "Personal Information", PersonalInfoEditor],
  ["professionalSummary", "Professional Summary", SummaryEditor],
  ["education", "Education", EducationEditor],
  ["workExperience", "Work Experience", ExperienceEditor],
  ["projects", "Projects", ProjectsEditor],
  ["skills", "Skills", SkillsEditor],
  ["certifications", "Certifications", CertificationsEditor],
  ["achievements", "Achievements", AchievementsEditor],
];

function initials(user) {
  return (user.displayName || user.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    getProfile(user.uid)
      .then((savedProfile) => {
        if (active) setProfile(savedProfile);
      })
      .catch((loadError) => {
        console.error("Failed to load profile:", loadError);
        if (active) setError("Unable to load your profile. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user.uid]);

  const updateSection = (section, value) => {
    setProfile((currentProfile) => ({ ...currentProfile, [section]: value }));
    setMessage("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await saveProfile(user.uid, profile);
      setMessage("Changes saved.");
    } catch (saveError) {
      console.error("Failed to save profile:", saveError);
      setError("Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (signOutError) {
      console.error("Failed to sign out:", signOutError);
      setError("Unable to sign out. Please try again.");
    }
  };

  if (loading) {
    return <main className="profile-page"><p className="profile-status">Loading profile...</p></main>;
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          {user.photoURL ? (
            <img className="profile-avatar" src={user.photoURL} alt="" />
          ) : (
            <div className="profile-avatar profile-avatar-initials">{initials(user)}</div>
          )}
          <div>
            <p className="profile-eyebrow">Account profile</p>
            <h1>{user.displayName || "Your Profile"}</h1>
            <p>{user.email}</p>
          </div>
        </header>

        <div className="profile-heading-row">
          <div>
            <h2>Your Information</h2>
            <p>Manage the information used to create your resumes.</p>
          </div>
          <button type="button" className="profile-signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        {error && <p className="profile-error" role="alert">{error}</p>}
        {message && <p className="profile-success" role="status">{message}</p>}

        <div className="profile-sections">
          {sections.map(([section, title, Editor]) => (
            <section className="profile-section" key={section}>
              <h2>{title}</h2>
              <Editor
                value={profile[section]}
                onChange={(value) => updateSection(section, value)}
              />
            </section>
          ))}
        </div>

        <div className="profile-save-row">
          <button type="button" className="profile-save-button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
