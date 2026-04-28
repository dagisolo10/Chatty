import { create } from "zustand";

interface Util {
    showSearch: boolean;
    showChatMenu: boolean;
    showDetailMenu: boolean;

    toggleSearch: () => void;
    toggleChatMenu: () => void;
    toggleDetailMenu: () => void;
}

const useUtilStore = create<Util>((set) => ({
    showSearch: false,
    showChatMenu: false,
    showDetailMenu: false,

    toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
    toggleChatMenu: () => set((state) => ({ showChatMenu: !state.showChatMenu })),
    toggleDetailMenu: () => set((state) => ({ showDetailMenu: !state.showDetailMenu })),
}));

export default useUtilStore;
