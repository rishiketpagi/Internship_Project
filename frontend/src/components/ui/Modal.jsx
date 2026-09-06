import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  'aria-describedby': ariaDescribedBy
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements?.length) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`modal-overlay ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
      >
        <div className="modal__header">
          {title && (
            <h2 id="modal-title" className="modal__title">{title}</h2>
          )}
          {showCloseButton && (
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

Modal.displayName = 'Modal';

export default Modal;