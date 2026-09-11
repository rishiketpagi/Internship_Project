export default function EditorSection({
    title,
    sectionKey,
    isOpen,
    onToggle,
    children,
    isMovable,
    onDragStart,
    onDragOver,
    onDrop,
    onMove,
}) {
    return (
        <section
            className={`resume-editor-card${isOpen ? " is-open" : ""}`}
            draggable={isMovable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="resume-editor-card-header">
                {isMovable && (
                    <span className="resume-editor-drag-handle" aria-label={`Drag ${title} section`} title="Drag to reorder">
                        ⋮⋮
                    </span>
                )}
                <button
                    type="button"
                    className="resume-editor-card-toggle"
                    onClick={() => onToggle(sectionKey)}
                    aria-expanded={isOpen}
                >
                    <span className="resume-editor-card-title">{title}</span>
                    <span className="resume-editor-card-toggle-icon" aria-hidden="true">
                        {isOpen ? "−" : "+"}
                    </span>
                </button>
                {isMovable && (
                    <div className="resume-editor-reorder-actions">
                        <button type="button" onClick={() => onMove(sectionKey, -1)} aria-label={`Move ${title} up`} title="Move up">↑</button>
                        <button type="button" onClick={() => onMove(sectionKey, 1)} aria-label={`Move ${title} down`} title="Move down">↓</button>
                    </div>
                )}
            </div>
            {isOpen && <div className="resume-editor-card-content">{children}</div>}
        </section>
    );
}
