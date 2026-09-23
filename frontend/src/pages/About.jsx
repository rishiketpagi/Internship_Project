import React from "react";
import { Link } from "react-router-dom";
import "../styles/About.css";

export default function About() {
    return (
        <main className="about-page">
            <section className="about-hero">
                <div className="about-container">
                    <h1 className="about-heading">About ResumeAI</h1>
                    <p className="about-subtext">
                        We believe everyone deserves a resume that truly reflects their potential. ResumeAI leverages advanced technology to help you build professional, ATS-friendly resumes in minutes.
                    </p>
                </div>
            </section>

            <section className="about-content">
                <div className="about-container">
                    <div className="about-grid">
                        <div className="about-card">
                            <h2 className="about-card-title">Our Mission</h2>
                            <p className="about-card-desc">
                                Job hunting is hard enough. Our mission is to simplify the resume creation process, empowering job seekers with the tools they need to present their best selves to employers, without the hassle of formatting and writer's block.
                            </p>
                        </div>

                        <div className="about-card">
                            <h2 className="about-card-title">Why Choose Us?</h2>
                            <p className="about-card-desc">
                                We combine modern, professional design with smart AI extraction. Whether you're uploading an existing resume or starting from scratch, we ensure your skills and experience are highlighted exactly how recruiters want to see them.
                            </p>
                        </div>
                    </div>

                    <div className="about-cta">
                        <h2>Ready to get started?</h2>
                        <Link to="/create" className="btn-primary">
                            Create My Resume
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
