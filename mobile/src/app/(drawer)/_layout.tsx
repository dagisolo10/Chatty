import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import useThemeColors from "@/hooks/use-colors";
import { ScreenSkeleton } from "@/components/ui/skeleton";

export default function MainLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const { background, foreground, mutedForeground } = useThemeColors();

    if (!isLoaded) return <ScreenSkeleton tag="home" />;

    if (!isSignedIn) return <Redirect href="/(auth)/sign-up" />;

    return (
        <Drawer
            screenOptions={{
                headerShown: !false,
                headerTintColor: foreground,
                drawerActiveTintColor: foreground,
                drawerInactiveTintColor: mutedForeground,
                drawerContentStyle: { backgroundColor: background },
                headerStyle: { backgroundColor: background },
            }}
        >
            <Drawer.Screen name="(tabs)" options={{ title: "Tabs" }} />
            <Drawer.Screen name="profile" options={{ title: "Profile" }} />
            <Drawer.Screen name="new-group" options={{ title: "New Group" }} />
            <Drawer.Screen name="contacts" options={{ title: "Contacts" }} />
            <Drawer.Screen name="settings" options={{ title: "Settings" }} />
        </Drawer>
    );
}
