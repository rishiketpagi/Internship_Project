import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">
      <section className="home__hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="home__hero-content">
            <h1 id="hero-title" className="home__hero-title">
              Create Professional Resumes <span className="home__hero-highlight">Effortlessly</span>
            </h1>
            <p className="home__hero-description">
              Transform your career story into a polished, ATS-friendly resume.
              Upload your existing resume or describe your experience — our AI extracts
              and structures your information automatically.
            </p>
            <div className="home__hero-actions">
              <Link to="/input-resume">
                <Button size="lg" leftIcon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                }>
                  Get Started
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home__features" aria-labelledby="features-title">
        <div className="container">
          <header className="home__section-header">
            <h2 id="features-title" className="home__section-title">How It Works</h2>
            <p className="home__section-description">
              Three simple steps to your perfect resume
            </p>
          </header>

          <div className="home__features-grid">
            <Card className="home__feature-card" variant="elevated" padding="lg">
              <div className="home__feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="home__feature-title">Upload or Describe</h3>
              <p className="home__feature-description">
                Upload your existing PDF/DOCX resume or simply describe your background,
                skills, and experience in plain text.
              </p>
            </Card>

            <Card className="home__feature-card" variant="elevated" padding="lg">
              <div className="home__feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="home__feature-title">AI Extraction</h3>
              <p className="home__feature-description">
                Our AI analyzes your input and extracts structured data —
                education, experience, skills, projects, and more — automatically organized.
              </p>
            </Card>

            <Card className="home__feature-card" variant="elevated" padding="lg">
              <div className="home__feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h3 className="home__feature-title">Professional Templates</h3>
              <p className="home__feature-description">
                Choose from clean, modern templates. Export to PDF with one click.
                Your resume is ready to impress recruiters and pass ATS scans.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="home__cta" aria-labelledby="cta-title">
        <div className="container">
          <Card className="home__cta-card" variant="filled" padding="xl">
            <h2 id="cta-title" className="home__cta-title">Ready to Build Your Resume?</h2>
            <p className="home__cta-description">
              Join thousands of professionals who've created standout resumes in minutes.
            </p>
            <Link to="/input-resume">
              <Button size="lg" variant="primary" leftIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              }>
                Create Your Resume Now
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Home;