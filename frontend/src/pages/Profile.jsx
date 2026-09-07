import { useState, useEffect } from "react";
import { useToast } from "../components/ui/ToastContainer";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import Skeleton from "../components/ui/Skeleton";
import "../styles/Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    professionalSummary: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // TODO: Fetch from backend
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockProfile = {
        name: 'Raj Narayan',
        email: 'raj@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/rajnarayan',
        github: 'github.com/rajnarayan',
        portfolio: 'rajnarayan.dev',
        professionalSummary: 'Passionate full-stack developer with 3+ years of experience building scalable web applications. Expertise in React, Node.js, AWS, and PostgreSQL. Strong background in computer science with a focus on distributed systems and cloud architecture.',
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
    } catch (err) {
      showError("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile({ ...formData });
      setEditMode(false);
      success("Saved!", "Your profile has been updated.");
    } catch (err) {
      showError("Error", "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      // TODO: Delete from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(null);
      setFormData({
        name: '', email: '', phone: '', location: '',
        linkedin: '', github: '', portfolio: '', professionalSummary: ''
      });
      setShowDeleteModal(false);
      success("Deleted", "Your profile has been deleted.");
    } catch (err) {
      showError("Error", "Failed to delete profile");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile__skeleton">
            <Skeleton variant="rectangular" width="100%" height="200px" />
            <Skeleton variant="text" width="60%" lines={3} />
            <Skeleton variant="text" width="100%" lines={5} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile__header">
          <div>
            <h1 className="profile__title">Profile</h1>
            <p className="profile__subtitle">Manage your personal information and resume data</p>
          </div>
          <div className="profile__actions">
            {!editMode && profile && (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </Button>
            )}
            {editMode && (
              <div className="profile__edit-actions">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} loading={saving} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {profile && (
          <div className="profile__grid">
            <Card className="profile__card profile__card--main" variant="elevated" padding="lg">
              <div className="profile__avatar" aria-hidden="true">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="profile__name">{profile.name}</h2>
              <p className="profile__email">{profile.email}</p>
              <div className="profile__links">
                {profile.linkedin && (
                  <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="profile__link" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {profile.github && (
                  <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="profile__link" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {profile.portfolio && (
                  <a href={`https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer" className="profile__link" aria-label="Portfolio">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </a>
                )}
              </div>
            </Card>

            <Card className="profile__card" variant="elevated" padding="lg">
              <h3 className="profile__section-title">Contact Information</h3>
              <div className="profile__fields">
                {editMode ? (
                  <>
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      leftIcon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      }
                    />
                    <Input
                      label="Location"
                      name="location"
                      type="text"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleChange}
                      leftIcon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      }
                    />
                    <Input
                      label="LinkedIn"
                      name="linkedin"
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleChange}
                      leftIcon={
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      }
                    />
                    <Input
                      label="GitHub"
                      name="github"
                      type="text"
                      placeholder="github.com/username"
                      value={formData.github}
                      onChange={handleChange}
                      leftIcon={
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                      }
                    />
                    <Input
                      label="Portfolio"
                      name="portfolio"
                      type="url"
                      placeholder="yourwebsite.com"
                      value={formData.portfolio}
                      onChange={handleChange}
                      leftIcon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      }
                    />
                  </>
                ) : (
                  <>
                    {profile.phone && (
                      <div className="profile__field">
                        <span className="profile__field-label">Phone</span>
                        <span className="profile__field-value">{profile.phone}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="profile__field">
                        <span className="profile__field-label">Location</span>
                        <span className="profile__field-value">{profile.location}</span>
                      </div>
                    )}
                    {profile.linkedin && (
                      <div className="profile__field">
                        <span className="profile__field-label">LinkedIn</span>
                        <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="profile__field-value profile__field-link">
                          {profile.linkedin}
                        </a>
                      </div>
                    )}
                    {profile.github && (
                      <div className="profile__field">
                        <span className="profile__field-label">GitHub</span>
                        <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="profile__field-value profile__field-link">
                          {profile.github}
                        </a>
                      </div>
                    )}
                    {profile.portfolio && (
                      <div className="profile__field">
                        <span className="profile__field-label">Portfolio</span>
                        <a href={`https://${profile.portfolio}`} target="_blank" rel="noopener noreferrer" className="profile__field-value profile__field-link">
                          {profile.portfolio}
                        </a>
                      </div>
                    )}
                    {!profile.phone && !profile.location && !profile.linkedin && !profile.github && !profile.portfolio && (
                      <p className="profile__empty">No contact information added yet.</p>
                    )}
                  </>
                )}
              </div>
            </Card>

            <Card className="profile__card" variant="elevated" padding="lg">
              <h3 className="profile__section-title">Professional Summary</h3>
              {editMode ? (
                <Textarea
                  name="professionalSummary"
                  value={formData.professionalSummary}
                  onChange={handleChange}
                  placeholder="Write a brief professional summary..."
                  rows={5}
                  maxLength={2000}
                  showCharCount
                />
              ) : (
                <p className="profile__summary">{profile.professionalSummary || 'No summary added yet.'}</p>
              )}
            </Card>
          </div>
        )}

        {!profile && (
          <Card className="profile__card profile__card--empty" variant="outlined" padding="xl">
            <div className="profile__empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h3 className="profile__empty-title">No Profile Yet</h3>
              <p className="profile__empty-description">
                Create your profile to store your resume information and generate
                professional resumes tailored to specific roles.
              </p>
              <Button
                onClick={() => setEditMode(true)}
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                }
              >
                Create Profile
              </Button>
            </div>
          </Card>
        )}

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Profile"
          size="sm"
        >
          <p className="profile__modal-text">
            Are you sure you want to delete your profile? This action cannot be undone.
            All your resume data will be permanently removed.
          </p>
          <div className="profile__modal-actions">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Profile
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Profile;