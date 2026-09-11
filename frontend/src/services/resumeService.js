import {
    addDoc,
    collection,
    deleteDoc,
    doc,
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

export async function createResume(userId, resume) {
    const reference = await addDoc(resumesCollection(userId), {
        ...resume,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    const profile = await getProfile(userId);
    await mergeResumeIntoProfile(userId, resume.resumeData, profile);

    return reference.id;
}

export function updateResume(userId, resumeId, resume) {
    return updateDoc(resumeDocument(userId, resumeId), {
        ...resume,
        updatedAt: serverTimestamp(),
    }).then(async () => {
        const profile = await getProfile(userId);
        await mergeResumeIntoProfile(userId, resume.resumeData, profile);
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

export function deleteResume(userId, resumeId) {
    return deleteDoc(resumeDocument(userId, resumeId));
}