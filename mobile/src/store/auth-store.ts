import api from "@/lib/axios";
import { create } from "zustand";
import { isAxiosError } from "axios";
import { User } from "@/types/model";

interface Auth {
    user: User | null;
    loading: boolean;
    isSignedIn: boolean;
    error: string | null;
    lastToken: string | null;
    abortController: AbortController | null;
    setUser: (user: User) => void;
    getUser: (token: string) => Promise<void>;
    retryUser: () => Promise<void>;
    clearUser: () => void;
}

const useAuthStore = create<Auth>((set, get) => ({
    user: null,
    loading: false,
    isSignedIn: false,
    error: null,
    lastToken: null,
    abortController: null,

    setUser: (user: User) => {
        const controller = get().abortController;
        if (controller) controller.abort();
        set({ user, isSignedIn: true, loading: false, error: null, abortController: null });
    },

    getUser: async (token: string) => {
        await fetchUser(token, set, get);
    },

    retryUser: async () => {
        const token = get().lastToken;

        if (!token) {
            set({ error: "Missing auth token.", loading: false });
            return;
        }

        await fetchUser(token, set, get);
    },

    clearUser: () => {
        const controller = get().abortController;
        if (controller) controller.abort();
        set({ user: null, loading: false, error: null, isSignedIn: false, abortController: null, lastToken: null });
    },
}));

async function fetchUser(token: string, set: (partial: Partial<Auth>) => void, get: () => Auth) {
    const currentController = get().abortController;
    if (currentController) currentController.abort();

    const newController = new AbortController();

    if (!token) {
        set({ user: null, isSignedIn: false, loading: false, error: "Missing auth token.", abortController: null, lastToken: null });
        return;
    }

    set({ loading: true, error: null, abortController: newController, lastToken: token });

    try {
        const auth = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get("/auth", { ...auth, timeout: 8000, signal: newController.signal });
        const data = res.data;

        if (!data.success) {
            set({ user: null, isSignedIn: false, loading: false, error: data.error || "Failed to fetch user.", abortController: null });
            return;
        }

        set({ user: data.data, isSignedIn: true, loading: false, error: null, abortController: null });
    } catch (err: any) {
        const name = (err as { name?: string } | null)?.name;
        if (name === "CanceledError" || name === "AbortError") return;

        const backendError = isAxiosError(err) ? (err.response?.data as { error?: string } | undefined)?.error : undefined;
        const message =
            err.code === "ECONNABORTED" ? "Request timed out. Please check your connection." : (backendError ?? (err instanceof Error ? err.message : "Error fetching user."));
        console.error("Error fetching user in store", message);

        set({ user: null, isSignedIn: false, loading: false, error: message, abortController: null });
    }
}
export default useAuthStore;
