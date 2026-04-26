import { Button } from "../ui/interactive";

import { useMemo } from "react";
import { mockChats } from "@/mocks/chats";
import { Ionicons } from "@expo/vector-icons";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { Text, View } from "@/components/ui/display";
import { router, useLocalSearchParams } from "expo-router";

export default function DetailsHeader() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const color = useThemeColors();

    const toggleDetailMenu = useUtilStore((state) => state.toggleDetailMenu);

    const chat = useMemo(() => mockChats().find((item) => item.id === id), [id]);

    if (!chat) {
        return (
            <View className="justify-start">
                <Button onPress={() => router.back()} variant={"ghost"} size={"icon"} component>
                    <Ionicons name="arrow-back" size={20} color={color.foreground} />
                </Button>
            </View>
        );
    }

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

                <Button variant="ghost" size="icon" onPress={toggleDetailMenu} component>
                    <Ionicons name="ellipsis-vertical" size={20} color={color.foreground} />
                </Button>
            </View>
        </View>
    );
}
