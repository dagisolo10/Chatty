import { Tabs } from "expo-router";

export default function SubTabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
            <Tabs.Screen name="index" options={{ title: "Chats" }} />
            <Tabs.Screen name="users" options={{ href: null }} />
            <Tabs.Screen name="group" options={{ href: null }} />
        </Tabs>
    );
}
