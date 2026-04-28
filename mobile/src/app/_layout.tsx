import "@/app/global.css";

import { cn } from "@/lib/utils";
import { Stack } from "expo-router";
import useTheme from "@/store/theme-store";
import { ReactNode, useEffect } from "react";
import useAuthStore from "@/store/auth-store";
import { View } from "@/components/ui/display";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ScreenSkeleton } from "@/components/ui/skeleton";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) throw new Error("Add your Clerk Publishable Key to the .env file");

export default function RootLayout() {
    const { isDark } = useTheme();

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <AuthBootstrap>
                <ThemeComponent isDark={isDark}>
                    <Stack screenOptions={{ headerShown: false }} initialRouteName="(drawer)">
                        <Stack.Screen name="(chat)" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(drawer)" />
                        <Stack.Screen name="(onboarding)" />
                    </Stack>
                </ThemeComponent>
            </AuthBootstrap>
        </ClerkProvider>
    );
}

export function AuthBootstrap({ children }: { children: ReactNode }) {
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const user = useAuthStore((state) => state.user);
    const getUser = useAuthStore((state) => state.getUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) return clearUser();

        if (!user) {
            async function syncUser() {
                try {
                    const token = await getToken();
                    if (token) {
                        await getUser(token);
                    } else {
                        clearUser();
                    }
                } catch (e) {
                    console.error("Bootstrap sync failed", e);
                }
            }

            syncUser();
        }
    }, [user, clearUser, getUser, isLoaded, isSignedIn, getToken]);

    if (!isLoaded) return <ScreenSkeleton tag="app-shell" />;

    return children;
}

function ThemeComponent({ children, isDark }: { children: ReactNode; isDark: boolean }) {
    return <View className={cn(isDark ? "dark" : "", "flex-1")}>{children}</View>;
}
