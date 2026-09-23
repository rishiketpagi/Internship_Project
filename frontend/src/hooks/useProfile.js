import { useCallback, useEffect, useRef, useState } from "react";
import { getResumes } from "../services/resumeService";
import {
    createEmptyProfile,
    getProfile,
    saveProfile,
    syncProfileFromResumes,
} from "../services/profileService";

const AUTOSAVE_DELAY_MS = 1500;

export function useProfile(userId, sectionDefinitions = []) {
    const [profile, setProfile] = useState(createEmptyProfile);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [savedResumeCount, setSavedResumeCount] = useState(0);
    const [saveStatus, setSaveStatus] = useState("idle");
    const [openSections, setOpenSections] = useState(
        () => Object.fromEntries(sectionDefinitions.map((section) => [section.key, true]))
    );
    const debounceRef = useRef(null);
    const savedTimerRef = useRef(null);
    const saveQueueRef = useRef(Promise.resolve());
    const profileLoadedRef = useRef(false);
    const saveVersionRef = useRef(0);
    const skipNextSaveRef = useRef(false);

    const loadProfile = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setSyncing(true);
        profileLoadedRef.current = false;

        try {
            const [savedProfile, resumes] = await Promise.all([
                getProfile(userId),
                getResumes(userId),
            ]);
            const syncedProfile = await syncProfileFromResumes(userId, savedProfile, resumes);

            skipNextSaveRef.current = true;
            setProfile(syncedProfile);
            setSavedResumeCount(resumes.length);
            profileLoadedRef.current = true;
        } catch (error) {
            console.error("Failed to load profile:", error);
            setSaveStatus("error");
        } finally {
            setLoading(false);
            setSyncing(false);
        }
    }, [userId]);

    useEffect(() => {
        const loadTimer = window.setTimeout(() => loadProfile(), 0);
        return () => {
            window.clearTimeout(loadTimer);
            clearTimeout(debounceRef.current);
        };
    }, [loadProfile]);

    useEffect(() => {
        if (loading || !profileLoadedRef.current) return undefined;
        if (skipNextSaveRef.current) {
            skipNextSaveRef.current = false;
            return undefined;
        }

        const saveVersion = ++saveVersionRef.current;
        setSaveStatus("pending");
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSaveStatus("saving");
            saveQueueRef.current = saveQueueRef.current
                .catch(() => { })
                .then(() => saveProfile(userId, profile))
                .then(() => {
                    if (saveVersion !== saveVersionRef.current) return;
                    setSaveStatus("saved");
                    clearTimeout(savedTimerRef.current);
                    savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
                })
                .catch((error) => {
                    console.error("Auto-save failed:", error);
                    if (saveVersion === saveVersionRef.current) setSaveStatus("error");
                });
        }, AUTOSAVE_DELAY_MS);

        return () => clearTimeout(debounceRef.current);
    }, [loading, profile, userId]);

    const updateSection = useCallback((section, value) => {
        setProfile((currentProfile) => ({ ...currentProfile, [section]: value }));
    }, []);

    const toggleSection = useCallback((section) => {
        setOpenSections((currentSections) => ({
            ...currentSections,
            [section]: !currentSections[section],
        }));
    }, []);

    return {
        profile,
        loading,
        syncing,
        savedResumeCount,
        saveStatus,
        openSections,
        setOpenSections,
        loadProfile,
        updateSection,
        toggleSection,
    };
}
