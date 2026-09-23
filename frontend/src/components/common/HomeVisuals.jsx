export function HomeHeroVisual() {
    return (
        <div className="home-visual" aria-hidden="true">
            <div className="visual-panel">
                <div className="visual-header" />
                <div className="visual-body">
                    <div className="visual-line long" />
                    <div className="visual-line medium" />
                    <div className="visual-line short" />
                    <div className="visual-card-row">
                        <div className="visual-mini" />
                        <div className="visual-mini accent" />
                    </div>
                </div>
            </div>
        </div>
    );
}

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
