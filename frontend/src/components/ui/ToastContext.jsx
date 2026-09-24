import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();

    const addToast = useCallback(({ type = 'info', message, action, duration = 4000 }) => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        const newToast = { id, type, message, action };
        setToasts((prev) => [...prev, newToast]);

        if (duration) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message) => addToast({ type: 'success', message }), [addToast]);
    const error = useCallback((message) => addToast({ type: 'error', message }), [addToast]);
    const info = useCallback((message) => addToast({ type: 'info', message }), [addToast]);
    const warning = useCallback((message) => addToast({ type: 'warning', message }), [addToast]);
    
    const requireAuth = useCallback((message = "Sign in to save your resume") => {
        addToast({
            type: 'warning',
            message,
            action: {
                label: 'Sign In',
                onClick: () => navigate('/signin')
            },
            duration: 8000
        });
    }, [addToast, navigate]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning, requireAuth }}>
            {children}
            <div className="toast-container" aria-live="polite">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <div className="toast-content">
                            <span className="toast-message">{toast.message}</span>
                            {toast.action && (
                                <button 
                                    className="toast-action-btn"
                                    onClick={() => {
                                        toast.action.onClick();
                                        removeToast(toast.id);
                                    }}
                                >
                                    {toast.action.label}
                                </button>
                            )}
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
