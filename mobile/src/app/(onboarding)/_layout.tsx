import { useEffect } from "react";
import useAuthStore from "@/store/auth-store";
import { Stack, useRouter } from "expo-router";

export default function OnboardingLayout() {
    const router = useRouter();
    const { user, loading } = useAuthStore();

    useEffect(() => {
        if (loading) return;
        if (user) router.replace("/(main)");
    }, [loading, router, user]);

    return <Stack screenOptions={{ headerShown: false }} />;
}
