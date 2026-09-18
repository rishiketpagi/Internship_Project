/*
 * Navbar — minimal, single line, anchored.
 * Uses design tokens via Tailwind v4 @theme utilities (text-ink, bg-paper,
 * bg-accent, text-ink-inverse, etc.).
 */
import { useContext, useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const onClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [menuOpen]);

    const linkClass = ({ isActive }) =>
        `text-[length:var(--t-body)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)] ${isActive ? "text-ink font-medium" : "text-ink-muted hover:text-ink"}`;

    const primaryBtn =
        "inline-flex items-center justify-center h-9 px-4 rounded-full bg-accent text-ink-inverse text-[length:var(--t-body)] font-medium transition-[transform,background-color] duration-[var(--d-press)] ease-[var(--ease-out)] hover:bg-[var(--accent-hover)] active:scale-[0.97]";

    return (
        <header
            className="border-b sticky top-0 bg-paper"
            style={{
                borderColor: "var(--rule)",
                zIndex: "var(--z-topbar)",
            }}
        >
            <div className="max-w-[var(--max-w-content)] mx-auto px-6 lg:px-10 h-[var(--topbar-h)] flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2">
                    <span
                        className="w-6 h-6 rounded-md flex items-center justify-center text-ink-inverse text-[length:var(--t-mono)] font-semibold"
                        style={{ background: "var(--accent)" }}
                        aria-hidden="true"
                    >
                        R
                    </span>
                    <span className="text-[length:var(--t-body)] font-medium text-ink">Resume Studio</span>
                </Link>

                <nav className="hidden md:flex items-center gap-5" aria-label="Primary">
                    {user ? (
                        <>
                            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                            <NavLink to="/templates" className={linkClass}>Templates</NavLink>
                            <NavLink to="/my-resumes" className={linkClass}>My Resumes</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" end className={linkClass}>Home</NavLink>
                            <NavLink to="/templates" className={linkClass}>Templates</NavLink>
                        </>
                    )}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    {user ? (
                        <Link to="/create" className={primaryBtn}>
                            + New resume
                        </Link>
                    ) : (
                        <>
                            <NavLink to="/signin" className={linkClass}>Sign in</NavLink>
                            <Link to="/create" className={primaryBtn}>
                                Start a resume
                            </Link>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => setMenuOpen((s) => !s)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        className="md:hidden p-1.5 rounded-[var(--r-input)] text-ink-muted hover:text-ink hover:bg-paper-soft transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)]"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div ref={menuRef} className="md:hidden border-t bg-paper" style={{ borderColor: "var(--rule)" }}>
                    <nav className="px-6 py-4 flex flex-col gap-3" aria-label="Mobile">
                        {user ? (
                            <>
                                <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                                <NavLink to="/templates" className={linkClass} onClick={() => setMenuOpen(false)}>Templates</NavLink>
                                <NavLink to="/my-resumes" className={linkClass} onClick={() => setMenuOpen(false)}>My Resumes</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
                                <NavLink to="/templates" className={linkClass} onClick={() => setMenuOpen(false)}>Templates</NavLink>
                                <NavLink to="/signin" className={linkClass} onClick={() => setMenuOpen(false)}>Sign in</NavLink>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
