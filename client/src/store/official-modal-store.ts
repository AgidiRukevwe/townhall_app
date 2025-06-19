import { create } from "zustand";

interface OfficialModalState {
  selectedOfficialId: string | null;
  isOpen: boolean;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useOfficialModalStore = create<OfficialModalState>((set) => ({
  selectedOfficialId: null,
  isOpen: false,

  openModal: (id: string) =>
    set(() => ({
      selectedOfficialId: id,
      isOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      selectedOfficialId: null,
      isOpen: false,
    })),
}));
