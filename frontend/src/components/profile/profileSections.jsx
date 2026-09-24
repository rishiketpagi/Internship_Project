import { PROFILE_SECTIONS } from "./profileSectionConfig";

function Chevron() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export function ProfileSectionList({ profile, openSections, onToggle, onChange }) {
    return (
        <div className="profile-sections">
            {PROFILE_SECTIONS.map(({ key, label, icon, Editor }) => (
                <section className="profile-section-card" key={key} id={`profile-section-${key}`}>
                    <button
                        type="button"
                        className="profile-section-toggle"
                        onClick={() => onToggle(key)}
                        aria-expanded={openSections[key]}
                        id={`profile-toggle-${key}`}
                    >
                        <span className="profile-section-toggle-left">
                            <span className="profile-section-icon" aria-hidden="true">{icon}</span>
                            <span className="profile-section-label">{label}</span>
                        </span>
                        <span className={`profile-section-chevron ${openSections[key] ? "is-open" : ""}`} aria-hidden="true">
                            <Chevron />
                        </span>
                    </button>
                    {openSections[key] && (
                        <div className="profile-section-body">
                            <Editor value={profile[key]} onChange={(value) => onChange(key, value)} />
                        </div>
                    )}
                </section>
            ))}
        </div>
    );
}
