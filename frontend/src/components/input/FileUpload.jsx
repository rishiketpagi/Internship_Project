function ResumeFileUpload({ file, onFileChange }) {
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
        <div className="file-upload-wrapper">
            <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
            />

            {file && (
                <div className="file-details">
                    <p>Selected file: {file.name}</p>
                    <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            )}
        </div>
    );
}

export default ResumeFileUpload;