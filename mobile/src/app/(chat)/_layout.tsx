import { Stack } from "expo-router";
import useThemeColors from "@/hooks/use-colors";
import ChatHeader from "@/components/chat/chat-header";

export default function ChatLayout() {
    const color = useThemeColors();

    return (
        <Stack
            screenOptions={{
                headerTitle: () => <ChatHeader />,
                headerStyle: { backgroundColor: color.background },
                headerBackVisible: false,
            }}
        >
            <Stack.Screen name="[id]" options={{ title: "" }} />
        </Stack>
    );
}
