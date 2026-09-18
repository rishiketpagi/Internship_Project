/*
 * Surface — paper-toned container with optional hairline border.
 * The workhorse background block. No card-by-default — use Surface
 * only when a visual boundary is needed (modal, sheet, hovered row).
 */
export default function Surface({
    as: Tag = "div",
    tone = "paper",         // 'paper' | 'soft' | 'strong'
    bordered = true,
    radius = "surface",     // 'input' | 'card' | 'surface'
    elevation = "flat",     // 'flat' | 'pop'
    className = "",
    style = {},
    children,
    ...rest
}) {
    const toneClass = {
        paper: "bg-[var(--paper)]",
        soft: "bg-[var(--paper-soft)]",
        strong: "bg-[var(--paper-strong)]",
    }[tone];

    const radiusClass = {
        input: "rounded-[var(--r-input)]",
        card: "rounded-[var(--r-card)]",
        surface: "rounded-[var(--r-surface)]",
    }[radius];

    const elevClass = elevation === "pop" ? "shadow-[var(--shadow-pop)]" : "";

    const borderStyle = bordered ? { boxShadow: "var(--shadow-surface)" } : {};

    return (
        <Tag
            className={`${toneClass} ${radiusClass} ${elevClass} ${className}`}
            style={{ ...borderStyle, ...style }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
