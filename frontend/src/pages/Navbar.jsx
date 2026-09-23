import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const navLinkClass = ({ isActive }) =>
        `nav-link${isActive ? " active" : ""}`;

    const mobileNavLinkClass = ({ isActive }) =>
        `mobile-nav-link${isActive ? " active" : ""}`;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
                        ResumeAI
                    </NavLink>

                    {/* Desktop navigation links */}
                    <div className="navbar-links">
                        {user ? (
                            /* Authenticated links */
                            <>
                                <NavLink to="/dashboard" className={navLinkClass}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/templates" className={navLinkClass}>
                                    Templates
                                </NavLink>
                                <NavLink to="/my-resumes" className={navLinkClass}>
                                    My Resumes
                                </NavLink>
                                <NavLink to="/profile" className={navLinkClass}>
                                    Profile
                                </NavLink>
                            </>
                        ) : (
                            /* Guest links */
                            <>
                                <NavLink to="/" end className={navLinkClass}>
                                    Home
                                </NavLink>
                                <NavLink to="/templates" className={navLinkClass}>
                                    Templates
                                </NavLink>
                                <NavLink to="/about" className={navLinkClass}>
                                    About
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Desktop CTA + Hamburger */}
                    <div className="navbar-actions">
                        {!user && (
                            <NavLink to="/signin" className="navbar-signin">
                                Sign In
                            </NavLink>
                        )}
                        <NavLink to="/create" className="navbar-create">
                            Create Resume
                        </NavLink>

                        <button
                            className={`mobile-menu-button${menuOpen ? " open" : ""}`}
                            onClick={toggleMenu}
                            aria-label="Toggle navigation menu"
                            aria-expanded={menuOpen}
                        >
                            <span className="hamburger-bar" />
                            <span className="hamburger-bar" />
                            <span className="hamburger-bar" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile dropdown */}
            <div className={`mobile-menu${menuOpen ? " open" : ""}`} role="menu">
                {user ? (
                    /* Authenticated mobile links */
                    <>
                        <NavLink
                            to="/dashboard"
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/templates"
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            Templates
                        </NavLink>
                        <NavLink
                            to="/my-resumes"
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            My Resumes
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            Profile
                        </NavLink>
                    </>
                ) : (
                    /* Guest mobile links */
                    <>
                        <NavLink
                            to="/"
                            end
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/templates"
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            Templates
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={mobileNavLinkClass}
                            onClick={closeMenu}
                        >
                            About
                        </NavLink>
                    </>
                )}

                {!user && (
                    <NavLink
                        to="/signin"
                        className="mobile-nav-link"
                        onClick={closeMenu}
                    >
                        Sign In
                    </NavLink>
                )}
                {/* Create Resume — always visible in mobile */}
                <NavLink
                    to="/create"
                    className="mobile-nav-link mobile-create"
                    onClick={closeMenu}
                >
                    Create Resume
                </NavLink>
            </div>
        </>
    );
}