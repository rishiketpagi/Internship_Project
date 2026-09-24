import { useToast } from "../ui/ToastContext";

function ResumeFileUpload({
    file,
    onFileChange,
    accept = ".pdf,.docx,.png,.jpg,.jpeg,.webp",
    allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
        "image/webp",
    ],
    invalidMessage = "Please upload a PDF, DOCX, PNG, JPG, or WEBP file.",
}) {
    const { warning } = useToast();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        if (!allowedTypes.includes(selectedFile.type)) {
            warning(invalidMessage);
            event.target.value = "";
            return;
        }

        onFileChange(selectedFile);
    };

    return (
        <div className="file-upload-wrapper">
            <input
                type="file"
                accept={accept}
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