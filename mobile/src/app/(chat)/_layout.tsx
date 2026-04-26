import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { ScreenSkeleton } from "@/components/ui/skeleton";

export default function ChatLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return <ScreenSkeleton tag="home" />;

    if (!isSignedIn) return <Redirect href="/(auth)/sign-up" />;

    return <Stack screenOptions={{ headerShown: false }} />;
}
