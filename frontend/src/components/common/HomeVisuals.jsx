export function TemplateThumb({ templateId = "modern" }) {
    const normalizedId = (templateId || "modern").toLowerCase();

    return (
        <div className={`template-thumbnail thumb-${normalizedId}`} aria-hidden="true">
            <div className="thumb-line long" />
            <div className="thumb-line medium" />
            <div className="thumb-line short" />
            <div className="thumb-line long" />
            <div className="thumb-line medium" />
        </div>
    );
}
