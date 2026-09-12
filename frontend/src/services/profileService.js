import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const emptyProfile = {
    personalInfo: {},
    professionalSummary: "",
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
};

function profileDocument(userId) {
    return doc(db, "users", userId, "profile", "data");
}

function mergeUnique(existing = [], incoming = []) {
    const merged = [...existing];
    const seen = new Set(existing.map((value) => JSON.stringify(value)));

    incoming.forEach((value) => {
        const key = JSON.stringify(value);
        if (!seen.has(key)) {
            seen.add(key);
            merged.push(value);
        }
    });

    return merged;
}

export async function ensureProfile(user) {
    const reference = profileDocument(user.uid);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
        await setDoc(reference, {
            ...emptyProfile,
            personalInfo: {
                name: user.displayName || "",
                email: user.email || "",
            },
        });
    }
}

export async function getProfile(userId) {
    const snapshot = await getDoc(profileDocument(userId));
    if (!snapshot.exists()) return emptyProfile;

    const data = snapshot.data();
    return Object.fromEntries(
        Object.keys(emptyProfile).map((section) => [section, data[section] ?? emptyProfile[section]])
    );
}

export function saveProfile(userId, profile) {
    const profileData = Object.fromEntries(
        Object.keys(emptyProfile).map((section) => [section, profile[section] ?? emptyProfile[section]])
    );

    return setDoc(profileDocument(userId), {
        ...profileData,
    });
}

export function mergeResumeIntoProfile(userId, resumeData, existingProfile = emptyProfile) {
    const incoming = resumeData || {};
    const current = { ...emptyProfile, ...existingProfile };
    const personalInfo = { ...current.personalInfo };

    Object.entries(incoming.personalInfo || {}).forEach(([field, value]) => {
        if (!personalInfo[field] && value) personalInfo[field] = value;
    });

    return saveProfile(userId, {
        ...current,
        personalInfo,
        professionalSummary: current.professionalSummary || incoming.professionalSummary || "",
        education: mergeUnique(current.education, incoming.education),
        workExperience: mergeUnique(current.workExperience, incoming.workExperience),
        projects: mergeUnique(current.projects, incoming.projects),
        skills: mergeUnique(current.skills, incoming.skills),
        certifications: mergeUnique(current.certifications, incoming.certifications),
        achievements: mergeUnique(current.achievements, incoming.achievements),
    });
}