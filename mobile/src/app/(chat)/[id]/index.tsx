import { Menu } from "@/components/chat/menu";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { GiftedChat } from "react-native-gifted-chat";
import { useCallback, useEffect, useState } from "react";
import { Screen, Text, View } from "@/components/ui/display";
import { useHeaderHeight } from "@react-navigation/elements";
import ChatSearchBar from "@/components/chat/chat-search-bar";

export default function ChatScreen() {
    const headerHeight = useHeaderHeight();
    const color = useThemeColors();

    const [messages, setMessages] = useState([]);

    const showSearch = useUtilStore((s) => s.showSearch);
    const toggleSearch = useUtilStore((s) => s.toggleSearch);
    const showChatMenu = useUtilStore((s) => s.showChatMenu);
    const [query, setQuery] = useState("");

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    }, []);

    useEffect(() => {
        return () => {
            setQuery("");
            if (useUtilStore.getState().showSearch) useUtilStore.getState().toggleSearch();
            if (useUtilStore.getState().showChatMenu) useUtilStore.getState().toggleChatMenu();
        };
    }, []);

    useEffect(() => {
        setMessages([
            // { _id: 1, text: "Hello developer", createdAt: new Date(), user: { _id: 2, name: "John Doe", avatar: "https://placeimg.com/140/140/any" } }
        ]);
    }, []);

    return (
        <Screen noSafeArea nonScrollable>
            <ChatSearchBar query={query} setQuery={setQuery} color={color} toggleSearch={toggleSearch} showSearch={showSearch} />
            <Menu show={showChatMenu} tag="chat" />
            <View className="flex-1 items-center justify-center">
                <Text className="h1">Chat Screen</Text>
                <GiftedChat
                    messages={messages}
                    onSend={(messages) => onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                    isTyping
                    reply={{
                        swipe: {
                            isEnabled: true,
                            direction: "left",
                        },
                    }}
                    renderTypingIndicator={() => <Text className="text-muted-foreground">Typing...</Text>}
                    keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
                />
            </View>
        </Screen>
    );
}
