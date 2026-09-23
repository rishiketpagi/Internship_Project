import React, { useState } from "react";
import { rolesData, generalRole } from "../../data/roles";

export default function Step1SelectRole({ selectedRole, onSelectRole, onNext }) {
    const [customRole, setCustomRole] = useState(
        selectedRole && !rolesData.find(r => r.title === selectedRole) ? selectedRole : ""
    );

    const handleCustomRoleChange = (e) => {
        const val = e.target.value;
        setCustomRole(val);
        onSelectRole(val);
    };

    const handleRoleSelect = (title) => {
        setCustomRole("");
        onSelectRole(title);
    };

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 rounded-xl overflow-hidden p-6 sm:p-8 flex-grow">
            <div className="mb-4 text-center max-w-2xl mx-auto">
                <h2 className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">Step 1 — Select Role</h2>
                <h3 className="text-xl font-extrabold mb-2 text-slate-900 tracking-tight">What role are you applying for?</h3>
                {/* <p className="text-slate-500 text-sm">
                    Choose the role you want your resume tailored toward, or enter a custom role below.
                </p> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto mb-4 w-full">
                {rolesData.map((role, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => handleRoleSelect(role.title)}
                        className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                            selectedRole === role.title && !customRole
                                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                        <span className={`text-base font-bold mb-1 ${selectedRole === role.title && !customRole ? "text-blue-700" : "text-slate-800"}`}>
                            {role.title}
                        </span>
                        <p className={`text-xs mt-1 leading-snug ${selectedRole === role.title && !customRole ? "text-blue-600" : "text-slate-500"}`}>
                            {role.description}
                        </p>
                    </button>
                ))}
                
                {/* General Resume Button */}
                <button
                    type="button"
                    onClick={() => handleRoleSelect(generalRole.title)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                        selectedRole === generalRole.title && !customRole
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                >
                    <span className={`text-base font-bold mb-1 ${selectedRole === generalRole.title && !customRole ? "text-blue-700" : "text-slate-800"}`}>
                        {generalRole.title}
                    </span>
                    <p className={`text-xs mt-1 leading-snug ${selectedRole === generalRole.title && !customRole ? "text-blue-600" : "text-slate-500"}`}>
                        {generalRole.description}
                    </p>
                </button>
            </div>

            <div className="max-w-4xl mx-auto w-full mb-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-slate-500 font-medium">or enter a custom role</span>
                    </div>
                </div>
                <div className="mt-3">
                    <input 
                        type="text" 
                        value={customRole}
                        onChange={handleCustomRoleChange}
                        placeholder="e.g. Machine Learning Engineer" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>

            <div className="mt-auto flex justify-end border-t border-slate-100 pt-4">
                <button
                    onClick={onNext}
                    disabled={!selectedRole}
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
