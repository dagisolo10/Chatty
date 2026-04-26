import { mockChats } from "@/mocks/chats";
import { Ionicons } from "@expo/vector-icons";
import { Menu } from "@/components/chat/menu";
import useAuthStore from "@/store/auth-store";
import useUtilStore from "@/store/util-store";
import useThemeColors from "@/hooks/use-colors";
import { Button } from "@/components/ui/interactive";
import { useEffect, useMemo, useState } from "react";
import ImagePreview from "@/components/ui/image-preview";
import { Image, useWindowDimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Card, Screen, Text, View } from "@/components/ui/display";

export default function ProfileDetail() {
    const color = useThemeColors();
    const { width } = useWindowDimensions();
    const user = useAuthStore((state) => state.user);
    const showDetailMenu = useUtilStore((s) => s.showDetailMenu);
    const { id } = useLocalSearchParams<{ id: string }>();

    const [muted, setMuted] = useState(false);

    const chat = useMemo(() => mockChats().find((item) => item.id === id), [id]);

    useEffect(() => {
        return () => {
            if (useUtilStore.getState().showDetailMenu) useUtilStore.getState().toggleDetailMenu();
        };
    }, []);

    if (!chat || !user) {
        return (
            <Screen noSafeArea className="gap-6 pt-4">
                <View className="flex-1 items-center justify-center gap-4">
                    <Text className="h3">Chat or user not found</Text>
                    <Button onPress={() => router.back()} variant="outline" component>
                        <Text>Go Back</Text>
                    </Button>
                </View>
            </Screen>
        );
    }

    const galleryImages = user.profile ? Array.from({ length: 6 }, (_, index) => ({ id: `${user.id}-profile-${index}`, uri: user.profile!, label: `Profile photo ${index + 1}` })) : [];

    const profile = user.profile;
    const chatTitle = chat.title;
    const username = `@${chatTitle.toLowerCase().replace(/\s+/g, "_")}`;
    const status = chat.online ? "online now" : `Last seen at ${chat.time ?? "--:--"}`;
    const initials =
        (user.name || chatTitle)
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return (
        <Screen noSafeArea className="gap-6 pt-4">
            <Menu show={showDetailMenu} tag="details" />

            <Card variant={"muted"} className="items-center gap-4">
                <View className="gap-4">
                    {profile ? (
                        <ImagePreview width={width} galleryImages={galleryImages}>
                            <Image source={{ uri: profile }} resizeMode="cover" className="size-24 rounded-full" />
                        </ImagePreview>
                    ) : (
                        <View className="bg-card size-24 items-center justify-center rounded-full">
                            <Text className="text-foreground text-4xl font-bold">{initials}</Text>
                        </View>
                    )}
                </View>

                <View className="items-center gap-2">
                    <Text className="text-foreground text-2xl font-bold">{chatTitle}</Text>
                    <Text className="text-primary text-sm font-semibold">{status}</Text>
                    <Text className="text-muted-foreground text-center">{chat.preview}</Text>
                </View>
            </Card>

            <View className="flex-row justify-between gap-4">
                <Button className="flex-1" size="content" variant="outline" component>
                    <View className="items-center gap-2 px-2 py-3">
                        <Ionicons name="chatbubble" color={color.primary} size={18} />
                        <Text>Message</Text>
                    </View>
                </Button>

                <Button className="flex-1" size="content" variant="outline" component>
                    <View className="items-center gap-2 px-2 py-3">
                        <Ionicons name="call" color={color.primary} size={18} />
                        <Text>Call</Text>
                    </View>
                </Button>

                <Button className="flex-1" size="content" variant="outline" component>
                    <View className="items-center gap-2 px-2 py-3">
                        <Ionicons name="videocam" color={color.primary} size={18} />
                        <Text>Video</Text>
                    </View>
                </Button>

                <Button className="flex-1" onPress={() => setMuted((prev) => !prev)} size="content" variant="outline" component>
                    <View className="items-center gap-2 px-2 py-3">
                        <Ionicons name={muted ? "notifications-off" : "notifications"} color={color.primary} size={18} />
                        <Text>{muted ? "Unmute" : "Mute"}</Text>
                    </View>
                </Button>
            </View>

            <Card variant={"muted"} className="gap-4">
                <View className="gap-1">
                    <Text className="text-primary text-xl font-bold">+251 91 112 3456</Text>
                    <Text className="text-muted-foreground text-xs">Mobile</Text>
                </View>

                <View className="gap-1">
                    <Text className="text-primary text-xl font-bold">{username}</Text>
                    <Text className="text-muted-foreground text-xs">Username</Text>
                </View>

                <View className="gap-1">
                    <Text className="text-primary text-xl font-bold">{chat.kind}</Text>
                    <Text className="text-muted-foreground text-xs">Conversation type</Text>
                </View>
            </Card>

            <Card variant={"muted"} className="gap-1 p-2">
                <Button className="flex-1" size="content" variant="ghost" component>
                    <View className="flex-1 flex-row justify-between px-3 py-4">
                        <View className="row gap-4">
                            <Ionicons name="images" color={color.primary} size={18} />
                            <Text>Photos and videos</Text>
                        </View>
                        <Text className="text-primary">51</Text>
                    </View>
                </Button>

                <Button className="flex-1" size="content" variant="ghost" component>
                    <View className="flex-1 flex-row justify-between px-3 py-4">
                        <View className="row gap-4">
                            <Ionicons name="musical-notes" color={color.primary} size={18} />
                            <Text>Shared music</Text>
                        </View>
                        <Text className="text-primary">14</Text>
                    </View>
                </Button>

                <Button className="flex-1" size="content" variant="ghost" component>
                    <View className="flex-1 flex-row justify-between px-3 py-4">
                        <View className="row gap-4">
                            <Ionicons name="link" color={color.primary} size={18} />
                            <Text>Shared links</Text>
                        </View>
                        <Text className="text-primary">8</Text>
                    </View>
                </Button>

                <Button className="flex-1" size="content" variant="ghost" component>
                    <View className="flex-1 flex-row justify-between px-3 py-4">
                        <View className="row gap-4">
                            <Ionicons name="document-text" color={color.primary} size={18} />
                            <Text>Files</Text>
                        </View>
                        <Text className="text-primary">23</Text>
                    </View>
                </Button>

                <Button className="flex-1" size="content" variant="ghost" component>
                    <View className="flex-1 flex-row justify-between px-3 py-4">
                        <View className="row gap-4">
                            <Ionicons name="color-wand" color={color.primary} size={18} />
                            <Text>Theme and wallpaper</Text>
                        </View>
                        <Text className="text-primary">Edit</Text>
                    </View>
                </Button>
            </Card>
        </Screen>
    );
}
