import { useLocalSearchParams } from "expo-router";
import { Screen, Text } from "@/components/ui/display";

export default function ChatScreen() {
    const { id } = useLocalSearchParams();

    return (
        <Screen className="items-center justify-center">
            <Text className="h1">ChatScreen</Text>
            <Text>{id}</Text>
        </Screen>
    );
}
