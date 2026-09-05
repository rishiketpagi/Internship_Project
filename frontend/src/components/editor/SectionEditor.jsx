function SectionEditor({ title, children }) {
    return (
        <section>
            {title && <h2>{title}</h2>}
            {children}
        </section>
    );
}

export default SectionEditor;
