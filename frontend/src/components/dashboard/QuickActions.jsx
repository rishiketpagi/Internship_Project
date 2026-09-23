import { Link } from "react-router-dom";

import { QUICK_ACTIONS } from "../../data/dashboardData";

export default function QuickActions() {
    return (
        <section className="quick-actions-section" aria-labelledby="quick-actions-label">
            <h2 id="quick-actions-label" className="dash-section-label">Quick Actions</h2>
            <nav className="quick-actions-grid" aria-label="Quick actions">
                {QUICK_ACTIONS.map((action) => (
                    <Link
                        key={action.route}
                        to={action.route}
                        className="quick-action-card"
                        aria-label={action.label}
                    >
                        <span className="qa-icon" aria-hidden="true">{action.icon}</span>
                        <h3 className="qa-title">{action.title}</h3>
                        <p className="qa-desc">{action.desc}</p>
                        <span className="qa-arrow" aria-hidden="true">→</span>
                    </Link>
                ))}
            </nav>
        </section>
    );
}