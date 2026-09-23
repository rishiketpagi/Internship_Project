import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export function createEmptyProfile() {
    return {
        personalInfo: {},
        professionalSummary: "",
        education: [],
        workExperience: [],
        projects: [],
        skills: [],
        certifications: [],
        achievements: [],
    };
}

export const emptyProfile = createEmptyProfile();

function profileDocument(userId) {
    return doc(db, "users", userId, "profile", "data");
}

function normalizedText(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function entryIdentity(section, entry) {
    if (typeof entry === "string") return normalizedText(entry);

    const identityFields = {
        education: ["institution", "degree", "field"],
        workExperience: ["company", "jobTitle"],
        projects: ["name"],
    }[section];

    if (identityFields) {
        const identity = identityFields.map((field) => normalizedText(entry[field])).filter(Boolean).join("|");
        return identity || null;
    }

    return null;
}

function mergeEntryValues(existing, incoming) {
    if (typeof existing === "string" || typeof incoming === "string") {
        return existing || incoming;
    }

    const merged = { ...existing };
    Object.entries(incoming || {}).forEach(([field, value]) => {
        if (Array.isArray(value)) {
            const currentValues = Array.isArray(merged[field]) ? merged[field] : [];
            merged[field] = [...new Set([...currentValues, ...value])];
        } else if (!merged[field] && value) {
            merged[field] = value;
        }
    });
    return merged;
}

function mergeEntries(section, existing = [], incoming = []) {
    const merged = [];

    [...existing, ...incoming].forEach((entry) => {
        const identity = entryIdentity(section, entry);
        const index = identity
            ? merged.findIndex((current) => entryIdentity(section, current) === identity)
            : merged.findIndex((current) => JSON.stringify(current) === JSON.stringify(entry));

        if (index === -1) {
            merged.push(entry);
        } else {
            merged[index] = mergeEntryValues(merged[index], entry);
        }
    });

    return merged;
}

function normalizeResumeData(resumeData = {}) {
    const candidateProfile = resumeData.candidateProfile || resumeData;

    return {
        personalInfo: candidateProfile.personalInfo || {},
        professionalSummary: candidateProfile.professionalSummary || candidateProfile.summary || "",
        education: candidateProfile.education || [],
        workExperience: candidateProfile.workExperience || candidateProfile.experience || [],
        projects: candidateProfile.projects || [],
        skills: candidateProfile.skills || [],
        certifications: candidateProfile.certifications || [],
        achievements: candidateProfile.achievements || [],
    };
}

export function mergeResumeDataIntoProfile(existingProfile, resumeData) {
    const incoming = normalizeResumeData(resumeData);
    const current = { ...createEmptyProfile(), ...existingProfile };
    const personalInfo = { ...(current.personalInfo || {}) };

    Object.entries(incoming.personalInfo).forEach(([field, value]) => {
        if (!personalInfo[field] && value) personalInfo[field] = value;
    });

    return {
        ...current,
        personalInfo,
        professionalSummary: current.professionalSummary || incoming.professionalSummary,
        education: mergeEntries("education", current.education, incoming.education),
        workExperience: mergeEntries("workExperience", current.workExperience, incoming.workExperience),
        projects: mergeEntries("projects", current.projects, incoming.projects),
        skills: mergeEntries("skills", current.skills, incoming.skills),
        certifications: mergeEntries("certifications", current.certifications, incoming.certifications),
        achievements: mergeEntries("achievements", current.achievements, incoming.achievements),
    };
}

function profilesMatch(first, second) {
    return JSON.stringify(first) === JSON.stringify(second);
}

export async function ensureProfile(user) {
    const reference = profileDocument(user.uid);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
        const profile = createEmptyProfile();
        await setDoc(reference, {
            ...profile,
            personalInfo: {
                name: user.displayName || "",
                email: user.email || "",
            },
        });
    }
}

export async function getProfile(userId) {
    const snapshot = await getDoc(profileDocument(userId));
    if (!snapshot.exists()) return createEmptyProfile();

    const data = snapshot.data();
    const defaults = createEmptyProfile();
    return Object.fromEntries(
        Object.keys(defaults).map((section) => [section, data[section] ?? defaults[section]])
    );
}

export function saveProfile(userId, profile) {
    const defaults = createEmptyProfile();
    const profileData = Object.fromEntries(
        Object.keys(defaults).map((section) => [section, profile[section] ?? defaults[section]])
    );

    return setDoc(profileDocument(userId), {
        ...profileData,
    });
}

export async function syncProfileFromResumes(userId, existingProfile, resumes = []) {
    const orderedResumes = [...resumes].sort((first, second) => {
        const firstTime = first.createdAt?.toMillis?.() || 0;
        const secondTime = second.createdAt?.toMillis?.() || 0;
        return firstTime - secondTime;
    });
    const firstResume = orderedResumes[0];
    if (!firstResume) return existingProfile;

    const mergedProfile = mergeResumeDataIntoProfile(
        createEmptyProfile(),
        firstResume.resumeData
    );

    if (profilesMatch(existingProfile, mergedProfile)) return existingProfile;

    await saveProfile(userId, mergedProfile);
    return mergedProfile;
}

export function mergeResumeIntoProfile(userId, resumeData, existingProfile = emptyProfile) {
    return saveProfile(userId, mergeResumeDataIntoProfile(existingProfile, resumeData));
}