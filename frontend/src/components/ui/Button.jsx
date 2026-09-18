/*
 * Button — 3 variants, all pill, all scale(0.97) on :active.
 * No `transition: all`. Specific properties only.
 */
import { forwardRef } from "react";

const variantClass = {
    primary:
        "bg-[var(--accent)] text-[var(--ink-inverse)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]",
    ghost:
        "bg-transparent text-[var(--ink)] border border-[var(--rule-strong)] hover:bg-[var(--paper-soft)] active:bg-[var(--paper-strong)]",
    quiet:
        "bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-soft)]",
};

const sizeClass = {
    sm: "h-8 px-3 text-[var(--t-small)]",
    md: "h-10 px-4 text-[var(--t-body)]",
    lg: "h-12 px-5 text-[var(--t-body)]",
};

const Button = forwardRef(function Button(
    {
        variant = "primary",
        size = "md",
        type = "button",
        leadingIcon = null,
        trailingIcon = null,
        loading = false,
        disabled = false,
        className = "",
        children,
        ...rest
    },
    ref
) {
    const isDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className={[
                "inline-flex items-center justify-center gap-2",
                "rounded-[var(--r-button)]",
                "font-medium select-none",
                "transition-[transform,background-color,color,border-color] duration-[var(--d-press)] ease-[var(--ease-out)]",
                "active:scale-[0.97]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                "focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2",
                variantClass[variant],
                sizeClass[size],
                className,
            ].join(" ")}
            {...rest}
        >
            {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            ) : leadingIcon}
            <span>{children}</span>
            {!loading && trailingIcon}
        </button>
    );
});

export default Button;
