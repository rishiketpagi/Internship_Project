import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main" id="main-content" role="main">
        <Outlet />
      </main>
      <footer className="layout__footer" role="contentinfo">
        <div className="layout__footer-container">
          <p className="layout__footer-text">
            Resume Generator &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;