import { create } from 'zustand';

interface ModalStore {
    isCheckoutModalOpen: boolean;
    isAnotherModalOpen: boolean;
    clicked: boolean;
    openCheckoutModal: () => void;
    closeCheckoutModal: () => void;
    openAnotherModal: () => void;
    closeAnotherModal: () => void;
    changeCheckoutModal: () => void;
    toggleClicked: () => void;
    isCourseModalOpen: boolean;
    changeCourseModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
    isCheckoutModalOpen: false,
    isCourseModalOpen: false,
    isAnotherModalOpen: false,
    clicked: false,  // Initialize clicked state

    openCheckoutModal: () => set({ isCheckoutModalOpen: true }),
    closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),
    openAnotherModal: () => set({ isAnotherModalOpen: true }),
    closeAnotherModal: () => set({ isAnotherModalOpen: false }),

    changeCheckoutModal: () => set((state) => ({ isCheckoutModalOpen: !state.isCheckoutModalOpen })),
    changeCourseModal: () => set((state) => ({ isCourseModalOpen: !state.isCourseModalOpen })),
    // Toggle clicked state
    toggleClicked: () => set((state) => ({ clicked: !state.clicked })),
}));

export default useModalStore;
