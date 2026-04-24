import ImagePreview from "../ui/image-preview";
import { LoadingScreen, MissMatch } from "../ui/screen-ui";

import { useAuth } from "@clerk/expo";
import { useState, useRef } from "react";
import { GalleryImage } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/auth-store";
import useThemeColors from "@/hooks/use-colors";
import { Text, View } from "@/components/ui/display";
import DrawerThemeToggle from "@/components/drawer/drawer-theme-toggle";
import { FlatList, Image, Pressable, useWindowDimensions } from "react-native";
import { DrawerContentScrollView, DrawerItemList, type DrawerContentComponentProps } from "@react-navigation/drawer";

export default function DrawerContent(props: DrawerContentComponentProps) {
    const { width } = useWindowDimensions();

    const { isLoaded, isSignedIn } = useAuth();

    const { user, loading, error, retryUser } = useAuthStore();
    const { background, border, primary } = useThemeColors();

    const [galleryVisible, setGalleryVisible] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const galleryRef = useRef<FlatList<GalleryImage>>(null);
    const previewRef = useRef<FlatList<GalleryImage>>(null);

    const hasStoreMismatch = isLoaded && isSignedIn && !user;
    const galleryImages = user?.profile ? Array.from({ length: 6 }, (_, index) => ({ id: `${user.id}-profile-${index}`, uri: user.profile!, label: `Profile photo ${index + 1}` })) : [];

    if (!isLoaded || (!hasStoreMismatch && loading)) return <LoadingScreen />;

    if (hasStoreMismatch) return <MissMatch error={error} loading={loading} onPress={retryUser} />;

    if (!user) return <LoadingScreen />;

    const initials = user.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    function syncPreview(index: number) {
        previewRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    }

    function openGallery() {
        setActiveImageIndex(0);
        setGalleryVisible(true);

        requestAnimationFrame(() => {
            galleryRef.current?.scrollToIndex({ index: 0, animated: false });
            syncPreview(0);
        });
    }

    function handleGalleryScrollEnd(offsetX: number) {
        const nextIndex = Math.round(offsetX / width);

        if (nextIndex === activeImageIndex) return;

        setActiveImageIndex(nextIndex);
        syncPreview(nextIndex);
    }

    function jumpToImage(index: number) {
        setActiveImageIndex(index);
        galleryRef.current?.scrollToIndex({ index, animated: true });
        syncPreview(index);
    }

    const propsForImage = { galleryVisible, setGalleryVisible, galleryRef, galleryImages, activeImageIndex, handleGalleryScrollEnd, width, previewRef, jumpToImage };

    return (
        <>
            <View className="bg-background flex-1">
                <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="bg-muted rounded-4xl p-6">
                        <View className="mb-4 flex-row items-center justify-between">
                            <View className="size-18 items-center justify-center overflow-hidden rounded-full bg-white/20">
                                {user.profile ? (
                                    <Pressable onPress={openGallery}>
                                        <Image source={{ uri: user.profile }} accessibilityLabel={`${user.name} profile picture`} className="size-18 rounded-full" />
                                    </Pressable>
                                ) : (
                                    <Text className="text-2xl font-bold text-white">{initials || "C"}</Text>
                                )}
                            </View>

                            <View className="bg-card rounded-full p-3">
                                <Ionicons name="chatbubble-ellipses-outline" size={20} color={primary} />
                            </View>
                        </View>

                        <Text className="text-xl font-bold text-white">{user.name || "Chatty User"}</Text>
                        <Text className="text-sm font-medium text-white/80">{user.username ? `@${user.username}` : "Ready to start chatting"}</Text>
                    </View>

                    <View className="flex-1 px-3 py-4">
                        <DrawerItemList {...props} />
                    </View>
                </DrawerContentScrollView>

                <View className="gap-3 border-t p-4 pb-8" style={{ borderColor: border, backgroundColor: background }}>
                    <DrawerThemeToggle />
                    <Text className="text-muted-foreground text-center text-xs">Telegram-inspired layout for your conversations</Text>
                </View>
            </View>

            <ImagePreview props={propsForImage} />
        </>
    );
}
