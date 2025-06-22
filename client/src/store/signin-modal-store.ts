import { create } from "zustand";

interface SignInModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSignInModalStore = create<SignInModalState>((set) => ({
  isOpen: false,

  openModal: () =>
    set(() => ({
      isOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      isOpen: false,
    })),
}));
