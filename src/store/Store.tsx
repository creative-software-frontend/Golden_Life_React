import { create } from 'zustand';

interface ModalStore {
    isCheckoutModalOpen: boolean;
    isAnotherModalOpen: boolean;
    openCheckoutModal: () => void;
    closeCheckoutModal: () => void;
    openAnotherModal: () => void;
    closeAnotherModal: () => void;
    changeCheckoutModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
    isCheckoutModalOpen: false,
    isAnotherModalOpen: false,
    openCheckoutModal: () => set({ isCheckoutModalOpen: true }),
    closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),
    openAnotherModal: () => set({ isAnotherModalOpen: true }),
    closeAnotherModal: () => set({ isAnotherModalOpen: false }),
    changeCheckoutModal: () => set((state) => ({ isCheckoutModalOpen: !state.isCheckoutModalOpen })),
}));

export default useModalStore;
