import { useEffect, useState } from "react";
import { Menu } from "@/components/chat/menu";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import { NavLink } from "@/components/ui/interactive";
import { Screen, Text, View } from "@/components/ui/display";
import ChatSearchBar from "@/components/chat/chat-search-bar";

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const color = useThemeColors();
    const showSearch = useUtilStore((s) => s.showSearch);
    const toggleSearch = useUtilStore((s) => s.toggleSearch);
    const showChatMenu = useUtilStore((s) => s.showChatMenu);

    const [query, setQuery] = useState("");

    useEffect(() => {
        return () => {
            setQuery("");
            if (useUtilStore.getState().showSearch) useUtilStore.getState().toggleSearch();
            if (useUtilStore.getState().showChatMenu) useUtilStore.getState().toggleChatMenu();
        };
    }, []);

    return (
        <Screen noSafeArea>
            <ChatSearchBar query={query} setQuery={setQuery} color={color} toggleSearch={toggleSearch} showSearch={showSearch} />

            <Menu show={showChatMenu} tag="chat" />

            <View className="flex-1 items-center justify-center">
                <Text className="h1">Chat Screen</Text>
                <Text>{id}</Text>

                <NavLink href={`/(chat)/${id}/details`}>Details</NavLink>
            </View>
        </Screen>
    );
}
