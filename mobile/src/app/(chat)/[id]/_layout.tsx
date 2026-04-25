import { Stack } from "expo-router";
import useThemeColors from "@/hooks/use-colors";
import ChatHeader from "@/components/chat/chat-header";
import DetailsHeader from "@/components/chat/details-header";

export default function ChatLayout() {
    const color = useThemeColors();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerBackVisible: false,
                    headerTitle: () => <ChatHeader />,
                    headerStyle: { backgroundColor: color.background },
                }}
            />
            <Stack.Screen
                name="details"
                options={{
                    headerBackVisible: false,
                    headerTitle: () => <DetailsHeader />,
                    headerStyle: { backgroundColor: color.background },
                }}
            />
        </Stack>
    );
}
