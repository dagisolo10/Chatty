import { create } from "zustand";

interface Util {
    showSearch: boolean;
    toggleSearch: () => void;
}

const useUtilStore = create<Util>((set) => ({
    showSearch: false,
    toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}));

export default useUtilStore;
