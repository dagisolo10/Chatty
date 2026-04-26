import { create } from "zustand";

interface Util {
    showSearch: boolean;
    toggleSearch: () => void;
    showChatMenu: boolean;
    toggleChatMenu: () => void;
    showDetailMenu: boolean;
    toggleDetailMenu: () => void;
}

const useUtilStore = create<Util>((set) => ({
    showSearch: false,
    toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
    showChatMenu: false,
    toggleChatMenu: () => set((state) => ({ showChatMenu: !state.showChatMenu })),
    showDetailMenu: false,
    toggleDetailMenu: () => set((state) => ({ showDetailMenu: !state.showDetailMenu })),
}));

export default useUtilStore;
