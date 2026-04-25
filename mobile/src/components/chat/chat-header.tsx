import ImagePreview from "../ui/image-preview";

import { mockChats } from "@/mocks/chats";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/auth-store";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { Button } from "@/components/ui/interactive";
import { Text, View } from "@/components/ui/display";
import { Image, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function ChatHeader() {
    const { width } = useWindowDimensions();
    const { id } = useLocalSearchParams<{ id: string }>();
    const user = useAuthStore((state) => state.user);
    const color = useThemeColors();
    const { setShowSearch } = useUtilStore();
    const [showMenu, setShowMenu] = useState(false);

    const chat = useMemo(() => mockChats(user?.name ?? "Saved messages").find((item) => item.id === id), [id, user?.name]);

    if (!chat) return null;

    const { title, preview, time } = chat;
    const galleryImages = user?.profile
        ? Array.from({ length: 6 }, (_, index) => ({ id: `${user.id}-profile-${index}`, uri: user.profile!, label: `Profile photo ${index + 1}` }))
        : [];

    const profileUri = user?.profile;
    const initials =
        user?.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return (
        <View className="gap-2 pt-2">
            <View className="flex-row justify-between gap-4">
                <Button onPress={() => router.back()} variant={"ghost"} size={"content"} className="px-2" component>
                    <Ionicons name="arrow-back" size={20} color={color.foreground} />
                </Button>

                <View className="row flex-1 gap-3">
                    <View className="bg-muted size-12 items-center justify-center overflow-hidden rounded-full">
                        {profileUri ? (
                            <ImagePreview width={width} galleryImages={galleryImages}>
                                <Image source={{ uri: profileUri }} className="size-12" />
                            </ImagePreview>
                        ) : (
                            <Text className="text-foreground text-sm font-bold">{initials}</Text>
                        )}
                    </View>

                    <View className="flex-1">
                        <Text className="text-foreground text-base font-bold">{title}</Text>
                        <Text className="text-muted-foreground text-[12px]">Last Seen at {time}</Text>
                    </View>
                </View>

                <View className="row gap-2">
                    <Button variant="ghost" size="icon" onPress={setShowSearch} component>
                        <Ionicons name="search" size={20} color={color.foreground} />
                    </Button>

                    <Button variant="ghost" size="icon" onPress={() => setShowMenu((prev) => !prev)} component>
                        <Ionicons name="ellipsis-vertical" size={20} color={color.foreground} />
                    </Button>
                </View>
            </View>

            <View className="border-primary gap-1 border-l-2 pl-2">
                <Text className="text-primary">Bio</Text>
                <Text className="text-muted-foreground">{preview}</Text>
            </View>

            {showMenu && (
                <View className="bg-card border-border absolute top-16 right-4 z-10 gap-2 rounded-lg border p-2">
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
