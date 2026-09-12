function SummaryEditor({ value = "", onChange = () => { } }) {
    return (
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write a short professional summary"
            className="resume-editor-textarea resume-editor-summary"
            rows={5}
        />
    );
}

export default SummaryEditor;
