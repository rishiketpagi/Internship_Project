/*
 * Rule — hairline horizontal or vertical divider.
 * No motion. No interaction. Pure structure.
 */
export default function Rule({ orientation = "horizontal", strong = false, className = "" }) {
    const base = strong ? "rule rule-strong" : "rule";
    if (orientation === "vertical") {
        return (
            <span
                role="separator"
                aria-orientation="vertical"
                className={`inline-block w-px h-full align-middle ${strong ? "bg-[var(--rule-strong)]" : "bg-[var(--rule)]"} ${className}`}
            />
        );
    }
    return <span role="separator" aria-orientation="horizontal" className={`${base} ${className}`} />;
}
