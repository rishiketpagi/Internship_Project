import { useRef } from "react";

export default function Step2Information({ 
    selectedRole, 
    selectedFile, 
    onFileSelect, 
    rawText, 
    onTextChange, 
    onNext, 
    onBack 
}) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-8 flex-grow">
            <div className="mb-4 text-center max-w-2xl mx-auto">
                <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-1">
                    {selectedRole.toUpperCase()}
                </h2>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Now, let's add your experience.
                </h3>
            </div>

            <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center mb-4">
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Add your existing resume</h4>
                    <div 
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] ${
                            selectedFile 
                                ? "border-blue-500 bg-blue-50" 
                                : "border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100"
                        }`}
                    >
                        {selectedFile ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">{selectedFile.name}</p>
                                    <button 
                                        onClick={() => onFileSelect(null)}
                                        className="text-red-500 text-sm font-medium hover:underline mt-1"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <p className="text-slate-600 text-sm font-medium mb-2">Drop your resume here</p>
                                <p className="text-slate-400 text-xs font-medium mb-2">or</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept=".pdf,.docx,.doc" 
                                    className="hidden" 
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Browse Files
                                </button>
                                <p className="text-slate-400 text-xs mt-2">PDF or DOCX</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">OR</span>
                    </div>
                </div>

                <div>
                    <textarea 
                        value={rawText}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder="Paste your resume or career information..." 
                        className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium resize-y"
                    ></textarea>
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
                <button
                    onClick={onNext}
                    disabled={!selectedFile && !rawText.trim()}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
