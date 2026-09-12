function ResumeTextInput({ value, onChange }) {
    return (
        <div className="text-input-wrapper">
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Example: I am a final year computer engineering student. I built..."
                rows={10}
            />
            <p className="char-count">Characters: {value.length}</p>
        </div>
    );
}

export default ResumeTextInput;