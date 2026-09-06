import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import Toast from './Toast';
import './ToastContainer.css';

const ToastContext = createContext(null);

let idCounter = 0;

function generateId() {
  return `toast-${++idCounter}-${Date.now()}`;
}

export function ToastProvider({ children, position = 'bottom-right' }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = generateId();
    const newToast = {
      id,
      type: 'default',
      duration: 5000,
      ...toast
    };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (title, message, options) => addToast({ type: 'success', title, message, ...options }),
    error: (title, message, options) => addToast({ type: 'error', title, message, ...options }),
    warning: (title, message, options) => addToast({ type: 'warning', title, message, ...options }),
    info: (title, message, options) => addToast({ type: 'info', title, message, ...options }),
    default: (title, message, options) => addToast({ type: 'default', title, message, ...options }),
    dismiss: removeToast
  }), [addToast, removeToast]);

  const positionClasses = {
    'top-left': 'toast-container--top-left',
    'top-right': 'toast-container--top-right',
    'bottom-left': 'toast-container--bottom-left',
    'bottom-right': 'toast-container--bottom-right',
    'top-center': 'toast-container--top-center',
    'bottom-center': 'toast-container--bottom-center'
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={`toast-container ${positionClasses[position] || positionClasses['bottom-right']}`} aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}