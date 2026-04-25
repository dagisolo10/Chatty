import { Button } from "../ui/interactive";

import { mockChats } from "@/mocks/chats";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { Text, View } from "@/components/ui/display";
import { router, useLocalSearchParams } from "expo-router";

export default function DetailsHeader() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const color = useThemeColors();

    const [showMenu, setShowMenu] = useState(false);

    const chat = useMemo(() => mockChats().find((item) => item.id === id), [id]);

    if (!chat) return null;

    const { title, time } = chat;

    return (
        <View className="relative gap-2 pt-2">
            <View className="flex-row justify-between gap-4">
                <View className="row gap-4">
                    <Button onPress={() => router.back()} variant={"ghost"} size={"content"} className="px-2" component>
                        <Ionicons name="arrow-back" size={20} color={color.foreground} />
                    </Button>

                    <View>
                        <Text>{title}</Text>
                        <Text>Last Seen {time}</Text>
                    </View>
                </View>

                <Button variant="ghost" size="icon" onPress={() => setShowMenu((prev) => !prev)} component>
                    <Ionicons name="ellipsis-vertical" size={20} color={color.foreground} />
                </Button>
            </View>

            {showMenu && (
                <View className="bg-accent absolute right-0 bottom-0 z-100 gap-2 rounded-lg p-2">
                    <Button variant="ghost" size="sm" onPress={() => console.log("Go to first message")} component>
                        <Text>Go to first message</Text>
                    </Button>
                    <Button variant="ghost" size="sm" onPress={() => console.log("Clear history")} component>
                        <Text>Clear history</Text>
                    </Button>
                    <Button variant="ghost" size="sm" onPress={() => console.log("Delete chat")} component>
                        <Text>Delete chat</Text>
                    </Button>
                    <Button variant="ghost" size="sm" onPress={() => console.log("Muted")} component>
                        <Text>Muted</Text>
                    </Button>
                </View>
            )}
        </View>
    );
}
