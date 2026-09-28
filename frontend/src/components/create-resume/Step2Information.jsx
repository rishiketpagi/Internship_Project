import { useRef, useState, useEffect } from "react";

export default function Step2Information({ 
    selectedRole, 
    selectedFile, 
    onFileSelect, 
    rawText, 
    onTextChange, 
    onNext, 
    onBack,
    onManualEntry,
    initialMode
}) {
    const fileInputRef = useRef(null);
    const [mode, setMode] = useState(initialMode || null);

    // If there is already data, set the mode so it doesn't show the menu again if going back
    useEffect(() => {
        if (initialMode) setMode(initialMode);
    }, [initialMode]);

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

    if (!mode) {
        return (
            <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-10 flex-grow">
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">
                        {selectedRole.toUpperCase()}
                    </h2>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        How would you like to build your resume?
                    </h3>
                    <p className="text-slate-500 mt-2 text-sm">Choose the method that works best for you.</p>
                </div>
                
                <div className="max-w-5xl mx-auto w-full flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card 1: Upload */}
                    <div 
                        onClick={() => setMode('upload')}
                        className="group relative cursor-pointer border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 bg-gradient-to-b from-white to-slate-50"
                    >
                        <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                            </div>
                            <h4 className="font-bold text-lg mb-3">Upload Existing</h4>
                            <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                                Upload your PDF or DOCX file. We'll automatically extract and organize your information.
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:gap-2 transition-all mx-auto mt-auto">
                                Upload File
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </span>
                        </div>
                    </div>
    
                    {/* Card 2: Manual */}
                    <div 
                        onClick={() => { setMode('manual'); onManualEntry && onManualEntry(); }}
                        className="group relative cursor-pointer border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300 bg-gradient-to-b from-white to-slate-50"
                    >
                        <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </div>
                            <h4 className="font-bold text-lg mb-3">Enter Manually</h4>
                            <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                                Start from scratch. Add your education, experience, and skills step by step using our wizard.
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 group-hover:gap-2 transition-all mx-auto mt-auto">
                                Start Typing
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </span>
                        </div>
                    </div>
    
                    {/* Card 3: Prompt */}
                    <div 
                        onClick={() => setMode('prompt')}
                        className="group relative cursor-pointer border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 bg-gradient-to-b from-white to-slate-50"
                    >
                        <div className="absolute inset-0 bg-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <h4 className="font-bold text-lg mb-3">Write a Prompt</h4>
                            <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                                Describe your background in your own words. Our AI will instantly structure the information for you.
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-purple-600 group-hover:gap-2 transition-all mx-auto mt-auto">
                                Write Prompt
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-auto flex items-center justify-start border-t border-slate-100 pt-4 max-w-5xl mx-auto w-full">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-sm font-bold transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-8 flex-grow">
            <div className="mb-6 text-center max-w-2xl mx-auto flex items-center justify-between w-full">
                <button onClick={() => setMode(null)} className="text-sm font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Change Method
                </button>
                <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase m-0">
                    {mode === 'upload' ? 'UPLOAD RESUME' : 'ENTER PROMPT'}
                </h2>
                <div className="w-24"></div> {/* Spacer for alignment */}
            </div>

            <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center mb-6">
                {mode === 'upload' && (
                    <div className="mb-4">
                        <div 
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={`group border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] cursor-pointer ${
                                selectedFile 
                                    ? "border-blue-500 bg-blue-50 shadow-inner" 
                                    : "border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-white hover:shadow-md"
                            }`}
                            onClick={() => !selectedFile && fileInputRef.current?.click()}
                        >
                            {selectedFile ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="font-bold text-slate-800 text-lg mb-1">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-500 mb-4">Ready to extract</p>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
                                            className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 mb-4 transition-colors duration-300 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                    </div>
                                    <p className="text-slate-800 text-xl font-extrabold mb-2">Drop your resume here</p>
                                    <p className="text-slate-500 text-sm font-medium mb-6">PDF or DOCX</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        accept=".pdf,.docx,.doc" 
                                        className="hidden" 
                                    />
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-2.5 rounded-xl text-sm font-bold group-hover:border-blue-500 group-hover:text-blue-600 transition-colors shadow-sm"
                                    >
                                        Browse Files
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
 
                {mode === 'prompt' && (
                    <div className="flex-grow flex flex-col bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                        <textarea 
                            value={rawText}
                            onChange={(e) => onTextChange(e.target.value)}
                            placeholder="Example: I'm a software engineer with 5 years of experience in React and Node.js. I previously worked at Google where I built a microservices architecture that served 1M+ requests daily..." 
                            className="w-full flex-grow min-h-[260px] p-6 bg-white rounded-xl text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-slate-300 font-medium resize-none shadow-sm"
                        ></textarea>
                    </div>
                )}
            </div>
 
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 max-w-4xl mx-auto w-full">
                <button
                    onClick={() => setMode(null)}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-sm font-bold transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Back
                </button>
                <button
                    onClick={() => onNext(mode)}
                    disabled={(mode === 'upload' && !selectedFile) || (mode === 'prompt' && !rawText.trim())}
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
