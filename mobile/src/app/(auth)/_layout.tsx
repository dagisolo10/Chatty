import useTheme from "@/store/theme-store";
import { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "@/store/auth-store";
import { ScreenSkeleton } from "@/components/ui/skeleton";

const TO = 100;
export default function AuthRoutesLayout() {
    const { isDark } = useTheme();
    // const { isLoaded } = useAuth();
    const { isSignedIn } = useAuthStore();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsLoaded(true), TO);
    }, []);

    if (!isLoaded) return <ScreenSkeleton tag="sign-in" />;

    if (isSignedIn) return <Redirect href={"/"} />;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                headerTitleStyle: { fontWeight: "700" },
                headerTintColor: isDark ? "#edf3ff" : "#12203f",
                headerStyle: { backgroundColor: isDark ? "#081327" : "#f3f7ff" },
                contentStyle: { backgroundColor: isDark ? "#081327" : "#f3f7ff" },
            }}
        />
    );
}
