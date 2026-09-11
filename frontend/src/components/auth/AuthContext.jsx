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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
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
            throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* values to frontend/.env.");
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
