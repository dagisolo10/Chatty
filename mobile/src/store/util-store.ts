import { create } from "zustand";

interface Util {
    showSearch: boolean;
    setShowSearch: () => void;
}

const useUtilStore = create<Util>((set) => ({
    showSearch: false,
    setShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}));

export default useUtilStore;
