import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL, getAuthToken } from '../utils';
import type { AppState } from '../useAppStore';

export interface Student {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    affiliate_id: string;
    mobile: string;
    image: string;
    refer_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    student_id?: string;
}


export interface PersonalInfo {
    id: number;
    student_id: string;
    father_name: string;
    mother_name: string;
    date_of_birth: string;
    religion: string;
    gender: string;
    blood_group: string;
    marital_status: string;
    country_name: string;
    division: string;
    district: string;
    upazila_thana_name: string;
    union_word_name: string;
    location: string;
    living_country: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentInfo {
    id: number;
    student_id: string;
    nid_number: string;
    nid_front_page: string;
    nid_back_page: string;
    created_at: string;
    updated_at: string;
}

export interface NomineeInfo {
    id: number;
    student_id: string;
    nominee_name: string;
    nominee_mobile: string;
    nominee_nid_number: string;
    relation_with: string;
    nominee_image: string;
    nominee_nid_front_page: string;
    nominee_nid_back_page: string;
    created_at: string;
    updated_at: string;
}

export interface AdditionalInfo {
    id: number;
    student_id: string;
    education: string;
    profession: string;
    monthly_income: string;
    hobby: string;
    interest: string;
    lifestyle: string;
    facebook_url: string;
    youtube_url: string;
    linkedin_url: string;
    telegram: string;
    x_url: string;
    tiktok_url: string;
    created_at: string;
    updated_at: string;
}

export interface ProfileSlice {
    studentProfile: Student | null;
    personalInfo: PersonalInfo | null;
    documentInfo: DocumentInfo | null;
    nomineeInfo: NomineeInfo | null;
    additionalInfo: AdditionalInfo | null;
    fetchProfile: (silent?: boolean) => Promise<void>;
    logout: (navigate: (path: string) => void) => void;
}

export const createProfileSlice: StateCreator<AppState, [], [], ProfileSlice> = (set, get) => ({
    studentProfile: null,
    personalInfo: null,
    documentInfo: null,
    nomineeInfo: null,
    additionalInfo: null,

    fetchProfile: async (silent = false) => {
        // Guard: If we're already loading or already have data (and not a silent refresh), skip.
        if (get().isProfileLoading || (get().isProfileFetched && !silent)) return;

        const token = getAuthToken();
        if (!token) return;

        if (!silent) set({ isProfileLoading: true });

        try {
            const response = await axios.get(`${baseURL}/api/student/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const resData = response.data;
            if (resData?.status === "success") {
                set({ 
                    studentProfile: resData.student,
                    personalInfo: resData.personal_info,
                    documentInfo: resData.document_info,
                    nomineeInfo: resData.nominee_info,
                    additionalInfo: resData.additional_info,
                    isProfileFetched: true 
                });

                // Sync balance with WalletSlice if available
                if (resData.balance !== undefined) {
                    set({ walletBalance: resData.balance });
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
            personalInfo: null,
            documentInfo: null,
            nomineeInfo: null,
            additionalInfo: null,
            walletBalance: "0.00",
            categories: [],
            transactions: []
        });
        navigate("/login");
        window.location.reload();
    }
});