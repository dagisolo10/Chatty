import api from "@/lib/axios";
import { create } from "zustand";
import { isAxiosError } from "axios";
import { User } from "@/types/response";

interface Auth {
    user: User | null;
    loading: boolean;
    isSignedIn: boolean;
    error: string | null;

    abortController: AbortController | null;

    getUser: (token: string) => Promise<void>;
    clearUser: () => void;
}

const useAuthStore = create<Auth>((set, get) => ({
    user: null,
    loading: false,
    isSignedIn: false,
    error: null,
    abortController: null,

    getUser: async (token: string) => {
        const currentController = get().abortController;
        if (currentController) {
            currentController.abort();
        }

        const newController = new AbortController();

        set({ loading: true, error: null, abortController: newController });

        if (!token) return set(() => ({ user: null, isSignedIn: false, loading: false, error: "Missing auth token." }));

        try {
            set(() => ({ loading: true, error: null }));

            const auth = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get("/auth", {
                ...auth,
                timeout: 8000,
                signal: newController.signal,
            });
            const data = res.data;

            if (!data.success) return set(() => ({ user: null, isSignedIn: false, loading: false, error: data.error || "Failed to fetch user.", abortController: null }));

            set(() => ({ user: data.data, isSignedIn: true, loading: false, error: null, abortController: null }));
        } catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;

            const backendError = isAxiosError(err) ? (err.response?.data as { error?: string } | undefined)?.error : undefined;
            const message =
                err.code === "ECONNABORTED" ? "Request timed out. Please check your connection." : (backendError ?? (err instanceof Error ? err.message : "Error fetching user."));
            console.error("Error fetching user in store", message);

            set(() => ({ user: null, isSignedIn: false, loading: false, error: message, abortController: null }));
        }
    },

    clearUser: () => set(() => ({ user: null, loading: false, error: null, isSignedIn: false })),
}));

export default useAuthStore;
