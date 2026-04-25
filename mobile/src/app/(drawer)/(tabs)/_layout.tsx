import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { DrawerToggleButton } from "@react-navigation/drawer";
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
        headerTintColor: color.foreground,
        headerStyle: { backgroundColor: color.background },
        headerLeft: () => <DrawerToggleButton tintColor={color.foreground} />,
    };

    return (
        <Tabs screenOptions={options}>
            <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ size, color }) => <Ionicons name="chatbubble" size={size} color={color} />, headerShown: false }} />
            <Tabs.Screen name="contacts" options={{ title: "Contacts", tabBarIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} /> }} />
            <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ size, color }) => <Ionicons name="settings" size={size} color={color} /> }} />
        </Tabs>
    );
}
