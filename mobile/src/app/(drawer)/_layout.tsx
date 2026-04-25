import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { ScreenSkeleton } from "@/components/ui/skeleton";
import DrawerContent from "@/components/drawer/drawer-content";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

export default function MainLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const color = useThemeColors();

    if (!isLoaded) return <ScreenSkeleton tag="home" />;

    if (!isSignedIn) return <Redirect href="/(auth)/sign-up" />;

    const options: DrawerNavigationOptions = {
        drawerType: "front",
        drawerStyle: { width: 320 },
        headerShadowVisible: false,
        headerTintColor: color.foreground,
        drawerActiveTintColor: color.foreground,
        drawerActiveBackgroundColor: color.card,
        headerTitleStyle: { marginLeft: 16 },
        drawerInactiveTintColor: color.mutedForeground,
        drawerContentStyle: { backgroundColor: color.background },
        drawerLabelStyle: { marginLeft: 0, fontSize: 15, fontWeight: "700" },
        headerStyle: { backgroundColor: color.background, borderBottomColor: color.border },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 0, marginVertical: 2, paddingHorizontal: 4 },
    };

    return (
        <Drawer drawerContent={(props) => <DrawerContent {...props} />} screenOptions={options}>
            <Drawer.Screen name="(tabs)" options={{ title: "Chats", drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />, headerShown: false }} />
            <Drawer.Screen name="profile" options={{ title: "My Profile", drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} /> }} />
            <Drawer.Screen name="new-group" options={{ title: "New Group", drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
        </Drawer>
    );
}
