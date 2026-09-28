import { useState } from "react";

/**
 * EditableCard
 *
 * Wraps a list entry in a read-only summary view.
 * Clicking "Edit" opens an inline edit form with Save + Cancel.
 *
 * Props:
 *   summary     – JSX shown in collapsed (read-only) view
 *   onDelete    – called when the Delete button is clicked
 *   openOnMount – if true the card starts in edit mode (for newly added items)
 *   children    – the edit form fields
 *   onSave      – called when Save is clicked (receives no args; parent owns state)
 *   onCancel    – called when Cancel is clicked
 */
export default function EditableCard({
    summary,
    onDelete,
    openOnMount = false,
    children,
    onSave,
    onCancel,
    isHidden = false,
    onToggleHide,
}) {
    const [editing, setEditing] = useState(openOnMount);

    const handleEdit = () => setEditing(true);

    const handleSave = () => {
        onSave?.();
        setEditing(false);
    };

    const handleCancel = () => {
        onCancel?.();
        setEditing(false);
    };

    return (
        <div className={`editable-card ${editing ? "editable-card--editing" : ""}`}>
            {editing ? (
                <>
                    <div className="editable-card-form">{children}</div>
                    <div className="editable-card-actions">
                        <button type="button" className="editable-card-save" onClick={handleSave}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Save
                        </button>
                        <button type="button" className="editable-card-cancel" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="button" className="editable-card-delete" onClick={onDelete}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </>
            ) : (
                <div className="editable-card-summary">
                    <div className="editable-card-summary-content">
                        {summary}
                        {isHidden && (
                            <span style={{ 
                                display: 'inline-block', 
                                marginTop: '0.5rem', 
                                padding: '0.2rem 0.5rem', 
                                fontSize: '0.65rem', 
                                background: '#fef2f2', 
                                color: '#ef4444', 
                                borderRadius: '4px', 
                                fontWeight: 'bold' 
                            }}>
                                HIDDEN FROM RESUME
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <button type="button" className="editable-card-edit-btn" onClick={onToggleHide} style={{ color: isHidden ? '#10b981' : '#64748b' }}>
                            {isHidden ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    Show
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    Hide
                                </>
                            )}
                        </button>
                        <button type="button" className="editable-card-edit-btn" onClick={handleEdit}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
