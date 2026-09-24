

export default function Step3JobDescription({ 
    jobDescription, 
    onJobDescriptionChange,
    jobDescriptionImage,
    onJobDescriptionImageChange,
    onNext, 
    onBack 
}) {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onJobDescriptionImageChange(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        onJobDescriptionImageChange(null);
    };
    return (
        <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-8 flex-grow">
            <div className="mb-6 text-center max-w-2xl mx-auto">
                <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">
                    JOB DESCRIPTION
                </h2>
                <h3 className="text-xl font-extrabold mb-2 text-slate-900 tracking-tight">
                    Have a specific job posting?
                </h3>
                <p className="text-slate-500 text-sm">
                    Paste the job description below to tailor your
                    resume more closely to that opportunity. <span className="font-semibold text-slate-600">(Optional)</span>
                </p>
            </div>

            <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center mb-6 gap-4">
                <textarea 
                    value={jobDescription}
                    onChange={(e) => onJobDescriptionChange(e.target.value)}
                    placeholder="Paste job description here..." 
                    className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium resize-y shadow-inner"
                ></textarea>

                <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">OR UPLOAD SCREENSHOT</span>
                    
                    {!jobDescriptionImage ? (
                        <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-4 px-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-600 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                <circle cx="9" cy="9" r="2"/>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                            <span className="text-sm font-bold">Upload image of job posting</span>
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg" 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </label>
                    ) : (
                        <div className="flex items-center justify-between w-full py-3 px-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                        <circle cx="9" cy="9" r="2"/>
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 truncate">
                                    {jobDescriptionImage.name}
                                </span>
                            </div>
                            <button 
                                onClick={handleRemoveImage}
                                className="text-slate-400 hover:text-red-500 transition-colors shrink-0 ml-4 p-1"
                                title="Remove image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 max-w-4xl mx-auto w-full">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-sm font-bold transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Back
                </button>
                
                <div className="flex gap-4">
                    <button
                        onClick={onNext}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        Continue
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
