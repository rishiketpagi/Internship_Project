import React from "react";
import { Link } from "react-router-dom";
import "../styles/About.css";

export default function About() {
    return (
        <main className="about-page">
            {/* Header Section */}
            <section className="about-hero">
                <div className="about-container">
                    <p className="about-eyebrow">ABOUT ROLERESUME</p>
                    <h1 className="about-heading">Build a resume that fits the role</h1>
                    <p className="about-subtext">
                        RoleResume helps you turn your existing experience into
                        a professional, role-specific resume without inventing
                        information.
                    </p>
                </div>
            </section>

            {/* What is RoleResume Section */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-box about-box-highlight">
                        <h2>WHAT IS ROLERESUME?</h2>
                        <p>
                            RoleResume is an AI-powered resume building application that 
                            helps users create job-specific resumes from information they 
                            already have.
                        </p>
                        <p>
                            Users can upload an existing resume or provide their information, 
                            select a target role, and generate a tailored resume.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why We Built It Section */}
            <section className="about-section about-centered">
                <div className="about-container">
                    <h2>WHY WE BUILT IT</h2>
                    <h3>Creating a resume for every job can take time.</h3>
                    <p className="about-text-constrained">
                        RoleResume is designed to make this process simpler by
                        helping users organize their existing experience and
                        present the most relevant information for a selected role.
                    </p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="about-section">
                <div className="about-container">
                    <h2 className="text-center mb-4">HOW IT WORKS</h2>
                    <div className="about-steps">
                        <div className="about-step-card">
                            <span className="about-step-num">01</span>
                            <p>Add Resume</p>
                        </div>
                        <div className="about-step-arrow">→</div>
                        <div className="about-step-card">
                            <span className="about-step-num">02</span>
                            <p>Select Role</p>
                        </div>
                        <div className="about-step-arrow">→</div>
                        <div className="about-step-card">
                            <span className="about-step-num">03</span>
                            <p>Generate Resume</p>
                        </div>
                        <div className="about-step-arrow-down">↓</div>
                        <div className="about-step-card about-step-card-final">
                            <span className="about-step-num">04</span>
                            <p>Edit, ATS Check & Download</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What RoleResume Offers Section */}
            <section className="about-section">
                <div className="about-container">
                    <h2 className="text-center mb-4">WHAT ROLE RESUME OFFERS</h2>
                    <div className="about-grid-2x3">
                        <div className="about-feature-box">
                            <p>Role-Based<br />Resume Generation</p>
                        </div>
                        <div className="about-feature-box">
                            <p>AI-Powered<br />Extraction</p>
                        </div>
                        <div className="about-feature-box">
                            <p>ATS Compatibility<br />Analysis</p>
                        </div>
                        <div className="about-feature-box">
                            <p>Professional<br />Templates</p>
                        </div>
                        <div className="about-feature-box">
                            <p>Resume Editing</p>
                        </div>
                        <div className="about-feature-box">
                            <p>PDF & DOCX<br />Export</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Approach Section */}
            <section className="about-section">
                <div className="about-container">
                    <h2 className="text-center mb-4">OUR APPROACH</h2>
                    <div className="about-box">
                        <h3>USE YOUR INFORMATION</h3>
                        <p>
                            RoleResume works with the information provided by the 
                            user. It is designed to organize and tailor existing 
                            experience rather than create unsupported qualifications.
                        </p>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="about-cta-section">
                <div className="about-container">
                    <h2>READY TO START?</h2>
                    <p>Create a resume tailored to your target role.</p>
                    <Link to="/create" className="about-btn-primary">
                        Create My Resume
                    </Link>
                </div>
            </section>
        </main>
    );
}
