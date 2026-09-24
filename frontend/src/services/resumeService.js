import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getProfile, mergeResumeIntoProfile } from "./profileService";

function resumesCollection(userId) {
    return collection(db, "users", userId, "resumes");
}

function resumeDocument(userId, resumeId) {
    return doc(db, "users", userId, "resumes", resumeId);
}

function resumeRecord(resume) {
    return {
        title: resume.title || "Untitled Resume",
        resumeData: resume.resumeData || {},
        templateId: resume.templateId || "modern",
        targetRole: resume.targetRole || "",
        jobDescription: resume.jobDescription || "",
        prompt: resume.prompt || "",
        atsAnalysis: resume.atsAnalysis || null,
    };
}

export async function createResume(userId, resume) {
    const record = resumeRecord(resume);
    const reference = await addDoc(resumesCollection(userId), {
        ...record,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    const profile = await getProfile(userId);
    await mergeResumeIntoProfile(userId, record.resumeData, profile);

    return reference.id;
}

export function updateResume(userId, resumeId, resume) {
    const record = resumeRecord(resume);
    return updateDoc(resumeDocument(userId, resumeId), {
        ...record,
        updatedAt: serverTimestamp(),
    }).then(async () => {
        const profile = await getProfile(userId);
        await mergeResumeIntoProfile(userId, record.resumeData, profile);
    });
}

export async function getResumes(userId) {
    const snapshot = await getDocs(resumesCollection(userId));

    return snapshot.docs
        .map((resumeSnapshot) => ({
            resumeId: resumeSnapshot.id,
            ...resumeSnapshot.data(),
        }))
        .sort((first, second) => {
            const firstTime = first.updatedAt?.toMillis?.() || 0;
            const secondTime = second.updatedAt?.toMillis?.() || 0;
            return secondTime - firstTime;
        });
}

export function renameResume(userId, resumeId, title) {
    return updateDoc(resumeDocument(userId, resumeId), {
        title,
        updatedAt: serverTimestamp(),
    });
}

export async function duplicateResume(userId, resume) {
    const resumeToCopy = { ...resume };
    delete resumeToCopy.resumeId;
    delete resumeToCopy.createdAt;
    delete resumeToCopy.updatedAt;

    return createResume(userId, {
        ...resumeToCopy,
        title: `Copy of ${resume.title || "Untitled Resume"}`,
    });
}

export function deleteResume(userId, resumeId) {
    return deleteDoc(resumeDocument(userId, resumeId));
}

export async function getResume(userId, resumeId) {
    const snapshot = await getDoc(resumeDocument(userId, resumeId));

    if (!snapshot.exists()) return null;

    return {
        resumeId: snapshot.id,
        ...snapshot.data(),
    };
}