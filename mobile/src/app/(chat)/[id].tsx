import { useState } from "react";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import { Screen, Text, View } from "@/components/ui/display";
import ChatSearchBar from "@/components/chat/chat-search-bar";

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const color = useThemeColors();
    const { showSearch, setShowSearch } = useUtilStore();

    const [query, setQuery] = useState("");

    return (
        <Screen noSafeArea>
            <ChatSearchBar query={query} setQuery={setQuery} color={color} setShowSearch={setShowSearch} showSearch={showSearch} />

            <View className="flex-1 items-center justify-center">
                <Text className="h1">Chat Screen</Text>
                <Text>{id}</Text>
            </View>
        </Screen>
    );
}
