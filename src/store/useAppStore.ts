import { create } from 'zustand';
import { createCategorySlice, CategorySlice } from './slices/categorySlice';
import { createProfileSlice, ProfileSlice } from './slices/profileSlice';
import { createWalletSlice, WalletSlice } from './slices/walletSlice';
import { createNotificationSlice, NotificationSlice } from './slices/notificationSlice';

// 1. Define the master AppState that combines all slices
export type AppState = CategorySlice & ProfileSlice & WalletSlice & NotificationSlice & {
    isCategoryLoading: boolean;
    isProfileLoading: boolean;
    isWalletLoading: boolean;
    isNotificationLoading: boolean;
    
    isCategoryFetched: boolean;
    isProfileFetched: boolean;
    isWalletFetched: boolean;
    isNotificationFetched: boolean;
};

// 2. Create the store and spread the slices inside
export const useAppStore = create<AppState>()((set, get, api) => ({
    isCategoryLoading: false,
    isProfileLoading: false,
    isWalletLoading: false,
    isNotificationLoading: false,
    
    isCategoryFetched: false,
    isProfileFetched: false,
    isWalletFetched: false,
    isNotificationFetched: false,

    // Inject all the specific slices
    ...createCategorySlice(set, get, api),
    ...createProfileSlice(set, get, api),
    ...createWalletSlice(set, get, api),
    ...createNotificationSlice(set, get, api),
}));