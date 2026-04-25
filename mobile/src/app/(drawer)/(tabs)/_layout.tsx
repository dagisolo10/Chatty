import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";

export default function TabsLayout() {
    const { background, border } = useThemeColors();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 72,
                    paddingTop: 6,
                    borderTopColor: border,
                    backgroundColor: background,
                },
                tabBarItemStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                },
            }}
        >
            <Tabs.Screen name="(sub-tabs)" options={{ title: "Home", tabBarIcon: ({ size, color }) => <Ionicons name="chatbubble" size={size} color={color} /> }} />
            <Tabs.Screen name="contacts" options={{ title: "Contacts", tabBarIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} /> }} />
            <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ size, color }) => <Ionicons name="settings" size={size} color={color} /> }} />
        </Tabs>
    );
}
