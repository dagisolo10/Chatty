import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "@/store/auth-store";
import Skeleton from "@/components/ui/skeleton";

export default function OnboardingLayout() {
    const { user, loading } = useAuthStore();
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded || loading) return <Skeleton />;

    if (!isSignedIn) return <Redirect href="/(auth)/sign-up" />;

    if (user) return <Redirect href="/(main)" />;

    return <Stack screenOptions={{ headerShown: false }} />;
}
