import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import { ProfileSectionList } from "../components/profile/profileSections";
import { PROFILE_SECTIONS } from "../components/profile/profileSectionConfig";
import { useProfile } from "../hooks/useProfile";
import "../styles/Profile.css";
import "../styles/ResumeEditor.css";

function initials(user) {
  return (user.displayName || user.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileSkeleton() {
  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-hero-card skeleton-hero">
          <div className="profile-skeleton-avatar" />
          <div className="profile-skeleton-lines">
            <div className="profile-skel profile-skel-eyebrow" />
            <div className="profile-skel profile-skel-name" />
            <div className="profile-skel profile-skel-email" />
          </div>
        </div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="profile-section-card profile-skeleton-card">
            <div className="profile-skel profile-skel-section-title" />
            <div className="profile-skel profile-skel-section-body" />
          </div>
        ))}
      </div>
    </main>
  );
}

// save status: "idle" | "pending" | "saving" | "saved" | "error"
export default function Profile() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    profile,
    loading,
    syncing,
    savedResumeCount,
    saveStatus,
    openSections,
    loadProfile,
    updateSection,
    toggleSection,
  } = useProfile(user.uid, PROFILE_SECTIONS);
  const totalItems = Object.entries(profile).reduce((count, [key, value]) => {
    if (key === "personalInfo" || key === "professionalSummary") return count;
    return count + (Array.isArray(value) ? value.length : 0);
  }, 0);

  const handleRefresh = () => loadProfile(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <main className="profile-page">
      <div className="profile-container">

        <header className="profile-hero-card">
          <div className="profile-hero-bg" aria-hidden="true" />
          <div className="profile-hero-body">
            {user.photoURL ? (
              <img className="profile-avatar" src={user.photoURL} alt="" />
            ) : (
              <div className="profile-avatar profile-avatar-initials">{initials(user)}</div>
            )}
            <div className="profile-hero-info">
              <p className="profile-eyebrow">Account Profile</p>
              <h1>{user.displayName || "Your Profile"}</h1>
              <p className="profile-hero-email">{user.email}</p>
            </div>
            <button
              type="button"
              className="profile-signout-button"
              onClick={handleSignOut}
              id="profile-signout-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </header>

        {/* <section className="profile-overview" aria-label="Profile overview">
          <div className="profile-overview-heading">
            <p className="profile-eyebrow">Your profile</p>
            <h2>Your professional baseline</h2>
            <p>Your first saved resume is the source for this profile. Add or refine details here and they will be saved automatically.</p>
          </div>
          <div className="profile-overview-actions">
            <button type="button" className="profile-refresh-button" onClick={handleRefresh} disabled={syncing}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
              </svg>
              {syncing ? "Loading" : "Reload first resume"}
            </button>
            <div className="profile-autosave-status" aria-live="polite">
              {saveStatus === "pending" && (
                <span className="autosave-dot autosave-pending" title="Unsaved changes" />
              )}
              {saveStatus === "saving" && (
                <span className="autosave-saving">
                  <span className="profile-spinner" aria-hidden="true" />
                  Saving…
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="autosave-saved">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved
                </span>
              )}
              {saveStatus === "error" && (
                <span className="autosave-error">Failed to save</span>
              )}
            </div>
          </div>
          <div className="profile-stats">
            <div><strong>{savedResumeCount > 0 ? "First" : "Manual"}</strong><span>Profile source</span></div>
            <div><strong>{totalItems}</strong><span>Career entries</span></div>
            <div><strong>{profile.professionalSummary ? "Ready" : "Start"}</strong><span>Summary</span></div>
          </div>
        </section> */}

        {saveStatus === "error" && (
          <div className="profile-alert profile-alert-error" role="alert">
            We could not sync your profile. Your changes will be retried when you edit or refresh.
          </div>
        )}

        <ProfileSectionList
          profile={profile}
          openSections={openSections}
          onToggle={toggleSection}
          onChange={updateSection}
        />

      </div>
    </main>
  );
}
