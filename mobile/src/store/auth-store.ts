import api from "@/lib/axios";
import { create } from "zustand";
import { isAxiosError } from "axios";
import { User } from "@/types/model";

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
        if (currentController) currentController.abort();

        const newController = new AbortController();

        if (!token) return set(() => ({ user: null, isSignedIn: false, loading: false, error: "Missing auth token.", abortController: null }));

        set({ loading: true, error: null, abortController: newController });

        try {
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
            const name = (err as { name?: string } | null)?.name;
            if (name === "CanceledError" || name === "AbortError") return;

            const backendError = isAxiosError(err) ? (err.response?.data as { error?: string } | undefined)?.error : undefined;
            const message =
                err.code === "ECONNABORTED" ? "Request timed out. Please check your connection." : (backendError ?? (err instanceof Error ? err.message : "Error fetching user."));
            console.error("Error fetching user in store", message);

            set(() => ({ user: null, isSignedIn: false, loading: false, error: message, abortController: null }));
        }
    },

    clearUser: () => {
        const controller = get().abortController;
        if (controller) controller.abort();
        set(() => ({ user: null, loading: false, error: null, isSignedIn: false, abortController: null }));
    },
}));

export default useAuthStore;
