import { Stack } from "expo-router";
import useThemeColors from "@/hooks/use-colors";
import ChatHeader from "@/components/chat/chat-header";
import DetailsHeader from "@/components/chat/details-header";

export default function ChatLayout() {
    const color = useThemeColors();

    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: color.background }, headerBackVisible: false }}>
            <Stack.Screen name="index" options={{ headerTitle: () => <ChatHeader /> }} />
            <Stack.Screen name="details" options={{ headerTitle: () => <DetailsHeader /> }} />
        </Stack>
    );
}
