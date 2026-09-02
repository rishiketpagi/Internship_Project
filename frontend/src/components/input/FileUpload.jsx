function ResumeFileUpload({ file, onFileChange, onContinue }) {
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            alert("Please upload a PDF or DOCX file.");
            event.target.value = "";
            return;
        }

        onFileChange(selectedFile);
    };

    return (
        <div>
            <h2>Upload Your Existing Resume</h2>

            <p>
                Upload your existing resume and we'll extract the
                information from it.
            </p>

            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
            />

            {file && (
                <div>
                    <p>Selected file: {file.name}</p>
                    <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>

                    <button
                        type="button"
                        onClick={onContinue}
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
}

export default ResumeFileUpload;