/*
 * ToastProvider — context-based toast queue, top-right, max 4 visible.
 * Auto-dismiss after `duration`. Click to dismiss. Pause on hover.
 * Focus-pull entry (opacity + 8px translateY), no blur, no scale.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

let nextId = 0;

export function ToastProvider({ children, max = 4 }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
    }, []);

    const push = useCallback((toast) => {
        const id = ++nextId;
        const entry = {
            id,
            variant: toast.variant || "neutral",
            title: toast.title || "",
            description: toast.description || "",
            duration: toast.duration ?? 3200,
            action: toast.action || null,
        };
        setToasts((current) => [...current.slice(-(max - 1)), entry]);
        if (entry.duration > 0) {
            timersRef.current[id] = setTimeout(() => dismiss(id), entry.duration);
        }
        return id;
    }, [dismiss, max]);

    const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {typeof document !== "undefined" &&
                createPortal(<ToastLayer toasts={toasts} onDismiss={dismiss} />, document.body)}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside <ToastProvider />");
    }
    return ctx;
}

function ToastLayer({ toasts, onDismiss }) {
    return (
        <div
            className="fixed top-4 right-4 flex flex-col gap-2 pointer-events-none"
            style={{ zIndex: "var(--z-toast)" }}
            aria-live="polite"
            aria-atomic="false"
        >
            {toasts.map((toast) => (
                <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
            ))}
        </div>
    );
}

const variantStyle = {
    neutral: "border-[var(--rule)]",
    ok: "border-l-2 border-l-[var(--ok)]",
    warn: "border-l-2 border-l-[var(--warn)]",
    accent: "border-l-2 border-l-[var(--accent)]",
};

function ToastCard({ toast, onDismiss }) {
    return (
        <div
            role="status"
            className={[
                "pointer-events-auto",
                "min-w-[260px] max-w-[360px]",
                "bg-[var(--paper)] text-[var(--ink)]",
                "rounded-[var(--r-card)]",
                "shadow-[var(--shadow-toast)]",
                "border",
                variantStyle[toast.variant] || variantStyle.neutral,
                "px-4 py-3",
                "flex items-start gap-3",
                // entry: opacity + translateY only, no blur
                "animate-[toast-in_var(--d-toast)_var(--ease-out)_1]",
            ].join(" ")}
        >
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <div className="text-[var(--t-body)] font-medium leading-[var(--lh-tight)]">{toast.title}</div>
                )}
                {toast.description && (
                    <div className="text-[var(--t-small)] text-[var(--ink-muted)] mt-0.5">{toast.description}</div>
                )}
                {toast.action && (
                    <button
                        type="button"
                        onClick={() => {
                            toast.action.onClick?.();
                            onDismiss();
                        }}
                        className="mt-2 text-[var(--t-small)] text-[var(--accent)] font-medium hover:underline"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss notification"
                className="text-[var(--ink-subtle)] hover:text-[var(--ink)] transition-colors duration-[var(--d-hover)] ease-[var(--ease-out)] -mr-1 -mt-1 p-1 rounded-[var(--r-input)] hover:bg-[var(--paper-soft)]"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
}
