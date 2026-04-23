import api from "@/lib/axios";
import { create } from "zustand";

interface Auth {
    user: any;
    loading: boolean;
    isSignedIn: boolean;
    error: string | null;

    getUser: (token: string) => Promise<void>;
    clearUser: () => void;
}

const useAuthStore = create<Auth>((set) => ({
    user: null,
    loading: false,
    isSignedIn: !true,
    error: null,

    getUser: async (token: string) => {
        if (!token) return set(() => ({ user: null, isSignedIn: false, loading: false, error: "Missing auth token." }));

        try {
            set(() => ({ loading: true, error: null }));

            const auth = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get("/auth", auth);
            const data = res.data;

            if (!data.success) return set(() => ({ user: null, isSignedIn: false, loading: false, error: data.error || "Failed to fetch user." }));

            set(() => ({ user: data.data, isSignedIn: true, loading: false, error: null }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error fetching user.";
            console.error("Error fetching user in store", message);

            set(() => ({ user: null, isSignedIn: false, loading: false, error: message }));
        }
    },

    clearUser: () => set(() => ({ user: null, loading: false, error: null, isSignedIn: false })),
}));

export default useAuthStore;
