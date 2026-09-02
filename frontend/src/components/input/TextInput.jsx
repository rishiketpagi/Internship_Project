function ResumeTextInput({ value, onChange, onContinue }) {
    return (
        <div>
            <h2>Enter Your Information</h2>

            <p>
                Tell us about your education, experience, projects,
                skills, certifications, achievements, and anything
                else you want included in your resume.
            </p>

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Example: I am a final year computer engineering student. I built..."
                rows={15}
            />

            <p>Characters: {value.length}</p>

            <button
                type="button"
                onClick={onContinue}
                disabled={!value.trim()}
            >
                Continue
            </button>
        </div>
    );
}

export default ResumeTextInput;