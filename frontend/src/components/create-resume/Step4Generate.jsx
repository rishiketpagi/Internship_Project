

export default function Step4Generate({ 
    selectedRole, 
    hasResumeInfo, 
    hasJobDescription,
    onGenerate, 
    onBack,
    loading,
    error
}) {
    return (
        <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-8 flex-grow relative">
            <div className="mb-6 text-center max-w-2xl mx-auto">
                <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">
                    READY TO BUILD
                </h2>
                <h3 className="text-xl font-extrabold mb-2 text-slate-900 tracking-tight">
                    {selectedRole || "Your Target Role"}
                </h3>
                <p className="text-slate-500 text-sm">
                    Your existing experience will be organized and tailored toward your selected role.
                </p>
            </div>

            <div className="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-700">Resume information</span>
                            {hasResumeInfo ? (
                                <span className="text-emerald-500 flex items-center justify-center bg-emerald-100 w-8 h-8 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </span>
                            ) : (
                                <span className="text-red-500 flex items-center justify-center bg-red-100 w-8 h-8 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </span>
                            )}
                        </li>
                        <div className="border-b border-slate-200"></div>
                        <li className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-700">Target role</span>
                            {selectedRole ? (
                                <span className="text-emerald-500 flex items-center justify-center bg-emerald-100 w-8 h-8 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </span>
                            ) : (
                                <span className="text-red-500 flex items-center justify-center bg-red-100 w-8 h-8 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </span>
                            )}
                        </li>
                        <div className="border-b border-slate-200"></div>
                        <li className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-700">Job description</span>
                            {hasJobDescription ? (
                                <span className="text-emerald-500 flex items-center justify-center bg-emerald-100 w-8 h-8 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </span>
                            ) : (
                                <span className="text-slate-500 font-semibold bg-slate-200 px-3 py-1 rounded-full text-sm">
                                    Optional
                                </span>
                            )}
                        </li>
                    </ul>
                </div>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={onGenerate}
                        disabled={loading || !selectedRole || !hasResumeInfo}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full text-base font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 relative"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            "Generate My Resume"
                        )}
                    </button>
                    <p className="text-slate-400 text-xs mt-3 font-medium">
                        Your resume will only use information you provide.
                    </p>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 max-w-4xl mx-auto w-full">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    Back
                </button>
            </div>
            
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-slate-100">
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Analyzing Profile...</h4>
                        <p className="text-slate-500 text-center text-sm">
                            We're extracting your experience and tailoring it for a {selectedRole} role. This usually takes 15-30 seconds.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
