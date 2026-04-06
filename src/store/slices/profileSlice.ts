import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface ProfileSlice {
    studentProfile: { name: string; image: string } | null;
    fetchProfile: (silent?: boolean) => Promise<void>;
    logout: (navigate: (path: string) => void) => void;
}

export const createProfileSlice: StateCreator<AppState, [], [], ProfileSlice> = (set, get) => ({
    studentProfile: null,

    fetchProfile: async (silent = false) => {
        // Guard: If we're already loading or already have data (and not a silent refresh), skip.
        if (get().isProfileLoading || (get().isProfileFetched && !silent)) return;

        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isProfileLoading: true });

        try {
            // Priority: Fetch from dashboard which is known to have the most complete 'student' object
            const response = await axios.get(`${baseURL}/api/student/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const resData = response.data;
            const isSuccess = resData?.status === "success" || resData?.status === true || resData?.success === true;
            
            if (isSuccess) {
                const dataRoot = resData.data || resData;
                const s = dataRoot.student || dataRoot.profile || dataRoot.user || (typeof dataRoot === 'object' && !Array.isArray(dataRoot) ? dataRoot : null);
                
                if (s) {
                    set({ 
                        studentProfile: {
                            ...s,
                            name: s.name || s.full_name || "Student",
                            image: s.image || s.active_image || s.profile_photo || null
                        }, 
                        isProfileFetched: true 
                    });
                }
            } else {
                // Secondary fallback to profile endpoint if dashboard fails
                const profRes = await axios.get(`${baseURL}/api/student/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (profRes.data?.status === "success" || profRes.data?.success) {
                    const p = profRes.data.data?.student || profRes.data.data || profRes.data;
                    set({ 
                        studentProfile: {
                            ...p,
                            name: p.name || "Student",
                            image: p.image || p.active_image || null
                        }, 
                        isProfileFetched: true 
                    });
                }
            }
        } catch (error) {
            console.error("Profile Fetch Error:", error);
        } finally {
            if (!silent) set({ isProfileLoading: false });
        }
    },

    logout: (navigate) => {
        sessionStorage.removeItem("student_session");
        // Reset state across all slices
        set({
            studentProfile: null,
            walletBalance: "0.00",
            categories: [],
            transactions: [] // Resetting wallet history too
        });
        navigate("/login");
        window.location.reload();
    }
});