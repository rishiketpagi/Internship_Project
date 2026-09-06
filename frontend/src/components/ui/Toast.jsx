import { useEffect, useState } from 'react';
import './Toast.css';

function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    default: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  };

  const colors = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-primary)',
    default: 'var(--color-text-secondary)'
  };

  return (
    <div
      className={`toast toast--${toast.type || 'default'} ${visible ? 'toast--visible' : ''}`}
      role="alert"
      aria-live="polite"
      style={{ '--toast-color': colors[toast.type || 'default'] }}
    >
      <div className="toast__icon" aria-hidden="true">
        {icons[toast.type || 'default']}
      </div>
      <div className="toast__content">
        {toast.title && <p className="toast__title">{toast.title}</p>}
        {toast.message && <p className="toast__message">{toast.message}</p>}
      </div>
      <button
        className="toast__close"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose(toast.id), 300);
        }}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div
        className="toast__progress"
        style={{
          backgroundColor: colors[toast.type || 'default'],
          animationDuration: `${toast.duration || 5000}ms`
        }}
        aria-hidden="true"
      />
    </div>
  );
}

export default Toast;