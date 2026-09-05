function SummaryEditor({ value = "", onChange = () => { } }) {
    return (
        <section>
            <h2>Professional summary</h2>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Write a short professional summary"
                rows={6}
            />
        </section>
    );
}

export default SummaryEditor;
