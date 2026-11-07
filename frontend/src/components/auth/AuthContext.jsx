/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { ensureProfile } from "../../services/profileService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(Boolean(auth));

    useEffect(() => {
        if (!auth) {
            return undefined;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    await ensureProfile(currentUser);
                } catch (error) {
                    console.error("Failed to initialize user profile:", error);
                }
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const requireFirebase = () => {
        if (!auth) {
            const missing = Object.entries({
                VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
                VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
            }).filter(([, v]) => !v).map(([k]) => k);
            throw new Error(
                missing.length
                    ? `Firebase is not configured. Missing env vars: ${missing.join(", ")}`
                    : "Firebase is not configured. Add the VITE_FIREBASE_* values to frontend/.env."
            );
        }
    };

    const signIn = (email, password) => {
        requireFirebase();
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (name, email, password) => {
        requireFirebase();
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (name.trim()) {
            await updateProfile(credential.user, { displayName: name.trim() });
        }

        await ensureProfile(credential.user);

        return credential.user;
    };

    const signInWithGoogle = async () => {
        requireFirebase();
        const credential = await signInWithPopup(
            auth,
            new GoogleAuthProvider()
        );
        await ensureProfile(credential.user);
        return credential.user;
    };

    const signOut = () => {
        requireFirebase();
        return firebaseSignOut(auth);
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
