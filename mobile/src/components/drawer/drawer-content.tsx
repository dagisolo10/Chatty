import ImagePreview from "../ui/image-preview";
import { LoadingScreen, MissMatch } from "../ui/screen-ui";

import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/auth-store";
import useThemeColors from "@/hooks/use-colors";
import { Text, View } from "@/components/ui/display";
import { Image, useWindowDimensions } from "react-native";
import DrawerThemeToggle from "@/components/drawer/drawer-theme-toggle";
import { DrawerContentScrollView, DrawerItemList, type DrawerContentComponentProps } from "@react-navigation/drawer";

export default function DrawerContent(props: DrawerContentComponentProps) {
    const { width } = useWindowDimensions();

    const { isLoaded, isSignedIn } = useAuth();

    const { user, loading, error, retryUser } = useAuthStore();
    const { background, border, primary } = useThemeColors();

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

    return (
        <View className="bg-background flex-1">
            <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
                <View className="bg-muted rounded-4xl p-6">
                    <View className="mb-4 flex-row items-center justify-between">
                        <View className="size-18 items-center justify-center overflow-hidden rounded-full bg-white/20">
                            {user.profile ? (
                                <ImagePreview width={width} galleryImages={galleryImages}>
                                    <Image source={{ uri: user.profile }} accessibilityLabel={`${user.name} profile picture`} className="size-18 rounded-full" />
                                </ImagePreview>
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
    );
}
