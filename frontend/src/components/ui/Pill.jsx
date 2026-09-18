/*
 * Pill — full-radius tag for skills, filters, status indicators.
 * Monochrome by default. Accent variant for selected/active.
 */
export default function Pill({
    variant = "neutral",       // 'neutral' | 'accent' | 'ok' | 'warn'
    size = "md",               // 'sm' | 'md'
    interactive = false,
    onClick,
    className = "",
    children,
    ...rest
}) {
    const variantClass = {
        neutral: "bg-[var(--paper-soft)] text-[var(--ink-muted)] border border-[var(--rule)]",
        accent: "bg-[var(--accent-soft)] text-[var(--accent)] border border-transparent",
        ok: "bg-[var(--ok-soft)] text-[var(--ok)] border border-transparent",
        warn: "bg-[var(--warn-soft)] text-[var(--warn)] border border-transparent",
    }[variant];

    const sizeClass = {
        sm: "h-6 px-2 text-[var(--t-mono)]",
        md: "h-7 px-3 text-[var(--t-small)]",
    }[size];

    const interactiveClass = interactive
        ? "cursor-pointer transition-[transform,background-color] duration-[var(--d-press)] ease-[var(--ease-out)] hover:bg-[var(--paper-strong)] active:scale-[0.97]"
        : "";

    const Tag = interactive ? "button" : "span";

    return (
        <Tag
            type={interactive ? "button" : undefined}
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-[var(--r-button)] ${variantClass} ${sizeClass} ${interactiveClass} ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}
