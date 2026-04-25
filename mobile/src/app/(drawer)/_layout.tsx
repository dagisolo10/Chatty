import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { ScreenSkeleton } from "@/components/ui/skeleton";
import DrawerContent from "@/components/drawer/drawer-content";

export default function MainLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const { background, foreground, mutedForeground, border, card } = useThemeColors();

    if (!isLoaded) return <ScreenSkeleton tag="home" />;

    if (!isSignedIn) return <Redirect href="/(auth)/sign-up" />;

    return (
        <Drawer
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                drawerType: "front",
                drawerStyle: { width: 320 },
                headerShadowVisible: false,
                headerTintColor: foreground,
                drawerActiveTintColor: foreground,
                drawerActiveBackgroundColor: card,
                drawerInactiveTintColor: mutedForeground,
                drawerContentStyle: { backgroundColor: background },
                drawerLabelStyle: { marginLeft: 0, fontSize: 15, fontWeight: "700" },
                headerStyle: {
                    backgroundColor: background,
                    borderBottomColor: border,
                },
                headerTitleStyle: {
                    marginLeft: 16,
                },
                drawerItemStyle: { borderRadius: 12, marginHorizontal: 0, marginVertical: 2, paddingHorizontal: 4 },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: "Chats",
                    headerShown: false,
                    drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="profile"
                options={{
                    title: "My Profile",
                    drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
                }}
            />
            <Drawer.Screen
                name="new-group"
                options={{ title: "New Group", drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }}
            />
            {/* <Drawer.Screen name="contacts" href="/(drawer)/(tabs)/contacts" options={{ title: "Contacts", drawerIcon: ({ color, size }) => <Ionicons name="call-outline" size={size} color={color} /> }} /> */}
            {/* <Drawer.Screen name="settings" href="/(drawer)/(tabs)/settings" options={{ title: "Settings", drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} /> */}
        </Drawer>
    );
}
