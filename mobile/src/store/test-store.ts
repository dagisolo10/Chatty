import { create } from "zustand";

interface Test {
    isLoaded: boolean;
    isSignedIn: boolean;
}

const useTestStore = create<Test>(() => ({
    isLoaded: true,
    isSignedIn: true,
}));

export default useTestStore;
