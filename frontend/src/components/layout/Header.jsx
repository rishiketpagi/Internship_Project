import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import './Header.css';

function Header({ onMenuClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/input-resume', label: 'Create Resume' },
    { path: '/profile', label: 'Profile' }
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`} role="banner">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="Resume Generator Home">
          <svg className="header__logo-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M8 12h16M8 16h12M8 20h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="header__logo-text">ResumeGen</span>
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`header__nav-link ${location.pathname === item.path ? 'header__nav-link--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <button
            className="header__menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <line x1="18" y1="6" x2="6" y2="18" />
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <nav>
          <ul className="header__mobile-nav-list">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`header__mobile-nav-link ${location.pathname === item.path ? 'header__mobile-nav-link--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;