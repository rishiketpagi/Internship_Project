/*
 * Field — label-above-input, helper text, error text.
 * No placeholder-as-label. WCAG AA contrast on label and helper.
 */
import { forwardRef, useId } from "react";

const Field = forwardRef(function Field(
    {
        label,
        helper,
        error,
        required = false,
        optional = false,
        as = "input",          // 'input' | 'textarea'
        rows = 3,
        className = "",
        inputClassName = "",
        id,
        ...rest
    },
    ref
) {
    const autoId = useId();
    const inputId = id || `f-${autoId}`;
    const helperId = helper ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-err` : undefined;
    const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

    const baseInputClass = [
        "w-full",
        "bg-[var(--paper)]",
        "text-[var(--ink)]",
        "placeholder:text-[var(--ink-subtle)]",
        "border-0 border-b border-[var(--rule)]",
        "rounded-none",
        "px-0 py-2",
        "transition-[border-color] duration-[var(--d-hover)] ease-[var(--ease-out)]",
        "hover:border-[var(--ink-subtle)]",
        "focus:border-[var(--accent)] focus:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "text-[var(--t-body)]",
        inputClassName,
    ].join(" ");

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-[var(--t-small)] font-medium text-[var(--ink)]">
                    {label}
                    {required && <span className="text-[var(--accent)] ml-1" aria-hidden="true">*</span>}
                    {optional && <span className="text-[var(--ink-subtle)] font-normal ml-1">(optional)</span>}
                </label>
            )}

            {as === "textarea" ? (
                <textarea
                    id={inputId}
                    ref={ref}
                    rows={rows}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={describedBy}
                    className={baseInputClass}
                    {...rest}
                />
            ) : (
                <input
                    id={inputId}
                    ref={ref}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={describedBy}
                    className={baseInputClass}
                    {...rest}
                />
            )}

            {error ? (
                <p id={errorId} role="alert" className="text-[var(--t-small)] text-[var(--warn)]">
                    {error}
                </p>
            ) : helper ? (
                <p id={helperId} className="text-[var(--t-small)] text-[var(--ink-subtle)]">
                    {helper}
                </p>
            ) : null}
        </div>
    );
});

export default Field;
