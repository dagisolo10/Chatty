import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";

export default function TabsLayout() {
    const { background } = useThemeColors();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarPosition: "top",
                tabBarStyle: {
                    height: 64,
                    paddingTop: 6,
                    borderBottomWidth: 0,
                    backgroundColor: background,
                },
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ size, color }) => <Ionicons name="logo-amazon" size={size} color={color} /> }} />
            <Tabs.Screen name="users" options={{ title: "Contacts", tabBarIcon: ({ size, color }) => <Ionicons name="folder" size={size} color={color} /> }} />
            <Tabs.Screen name="group" options={{ title: "Settings", tabBarIcon: ({ size, color }) => <Ionicons name="megaphone" size={size} color={color} /> }} />
        </Tabs>
    );
}
