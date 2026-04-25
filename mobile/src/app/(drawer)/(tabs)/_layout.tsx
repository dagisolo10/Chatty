import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { DrawerToggleButton } from "@react-navigation/drawer";

export default function TabsLayout() {
    const color = useThemeColors();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    height: 72,
                    paddingTop: 6,
                    borderTopWidth: 0,
                    backgroundColor: color.background,
                },
                headerTintColor: color.foreground,
                headerStyle: { backgroundColor: color.background },
                headerLeft: () => <DrawerToggleButton tintColor={color.foreground} />,
            }}
        >
            <Tabs.Screen
                name="(sub-tabs)"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ size, color }) => <Ionicons name="chatbubble" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="contacts"
                options={{ title: "Contacts", tabBarIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} /> }}
            />
            <Tabs.Screen
                name="settings"
                options={{ title: "Settings", tabBarIcon: ({ size, color }) => <Ionicons name="settings" size={size} color={color} /> }}
            />
        </Tabs>
    );
}
