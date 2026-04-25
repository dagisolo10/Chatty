import { useAuth } from "@clerk/expo";
import { Search } from "lucide-react-native";
import useAuthStore from "@/store/auth-store";
import useThemeColors from "@/hooks/use-colors";
import ImagePreview from "@/components/ui/image-preview";
import { Image, useWindowDimensions } from "react-native";
import { Input, NavLink } from "@/components/ui/interactive";
import { Screen, Text, View } from "@/components/ui/display";
import { LoadingScreen, MissMatch } from "@/components/ui/screen-ui";

export default function Home() {
    const { width } = useWindowDimensions();
    const { isLoaded, isSignedIn } = useAuth();
    const { user, loading, error, retryUser } = useAuthStore();
    const { primary } = useThemeColors();

    const hasStoreMismatch = isLoaded && isSignedIn && !user;
    const galleryImages = user?.profile ? Array.from({ length: 6 }, (_, index) => ({ id: `${user.id}-profile-${index}`, uri: user.profile!, label: `Profile photo ${index + 1}` })) : [];

    if (!isLoaded || (!hasStoreMismatch && loading)) return <LoadingScreen />;

    if (hasStoreMismatch) return <MissMatch error={error} loading={loading} onPress={retryUser} />;

    if (!user) return <LoadingScreen />;

    return (
        <Screen noSafeArea className="pt-2">
            <View className="relative">
                <Input placeholder="Search Chats" className="h-12 rounded-full pl-12" />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Search size={16} color={primary} />
                </View>
            </View>
        </Screen>
    );
}

// return (
//     <Screen onTab className="items-center">
//         {user.profile && (
//             <ImagePreview width={width} galleryImages={galleryImages}>
//                 <Image source={{ uri: user.profile }} accessibilityLabel={`${user.name} profile picture`} className="size-32 rounded-full" />
//             </ImagePreview>
//         )}

//         <Text className="h2">{user.name} ha</Text>
//         <Text className="text-primary">@{user.username}</Text>
//         {user.bio && <Text className="text-muted-foreground">{user.bio}</Text>}

//         <NavLink href="/(drawer)/settings">Settings</NavLink>
//     </Screen>
// );
