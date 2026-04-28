import ImagePreview from "../ui/image-preview";

import { mockChats } from "@/mocks/chats";
import { useEffect, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/auth-store";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { Button } from "@/components/ui/interactive";
import { Text, View } from "@/components/ui/display";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, useWindowDimensions } from "react-native";

export default function ChatHeader() {
    const color = useThemeColors();
    const { width } = useWindowDimensions();
    const user = useAuthStore((state) => state.user);
    const { id } = useLocalSearchParams<{ id: string }>();

    const toggleSearch = useUtilStore((state) => state.toggleSearch);
    const toggleChatMenu = useUtilStore((state) => state.toggleChatMenu);

    const chat = useMemo(() => mockChats().find((item) => item.id === id), [id]);

    useEffect(() => {
        return () => {
            if (useUtilStore.getState().showSearch) useUtilStore.getState().toggleSearch();
        };
    }, []);

    if (!chat) {
        return (
            <View className="justify-start">
                <Button onPress={() => router.back()} variant={"ghost"} size={"icon"} className="" component>
                    <Ionicons name="arrow-back" size={20} color={color.foreground} />
                </Button>
            </View>
        );
    }

    const { title, preview, time } = chat;
    const galleryImages = user?.profile ? Array.from({ length: 6 }, (_, index) => ({ id: `${user.id}-profile-${index}`, uri: user.profile!, label: `Profile photo ${index + 1}` })) : [];

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

                    <Link href={`/(chat)/${id}/details`} asChild>
                        <Pressable className="flex-1">
                            <Text className="text-foreground text-base font-bold">{title}</Text>
                            <Text className="text-muted-foreground text-[12px]">Last Seen at {time}</Text>
                        </Pressable>
                    </Link>
                </View>

                <View className="row gap-2">
                    <Button variant="ghost" size="icon" onPress={toggleSearch} component>
                        <Ionicons name="search" size={20} color={color.foreground} />
                    </Button>

                    <Button variant="ghost" size="icon" onPress={toggleChatMenu} component>
                        <Ionicons name="ellipsis-vertical" size={20} color={color.foreground} />
                    </Button>
                </View>
            </View>

            {preview && (
                <View className="border-primary gap-1 border-l-2 pl-2">
                    <Text className="text-primary">Bio</Text>
                    <Text className="text-muted-foreground">{preview}</Text>
                </View>
            )}
        </View>
    );
}
