import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import DrawerToggle from "@/components/drawer/custom-drawer-toggle";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export default function TabsLayout() {
    const color = useThemeColors();

    const options: BottomTabNavigationOptions = {
        tabBarStyle: {
            height: 72,
            paddingTop: 6,
            borderTopWidth: 0,
            backgroundColor: color.background,
        },
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.mutedForeground,
        headerStyle: { backgroundColor: color.background },
        headerLeft: () => <DrawerToggle alone />,
    };

    return (
        <Tabs screenOptions={options}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ size, focused, color }) => <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="contacts"
                options={{
                    title: "Contacts",
                    tabBarIcon: ({ size, focused, color }) => <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ size, focused, color }) => <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
