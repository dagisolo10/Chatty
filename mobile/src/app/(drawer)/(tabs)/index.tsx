import { useAuth } from "@clerk/expo";
import { useRef, useState } from "react";
import { GalleryImage } from "@/types/types";
import useAuthStore from "@/store/auth-store";
import { NavLink } from "@/components/ui/interactive";
import { Screen, Text } from "@/components/ui/display";
import ImagePreview from "@/components/ui/image-preview";
import { LoadingScreen, MissMatch } from "@/components/ui/screen-ui";
import { FlatList, Image, Pressable, useWindowDimensions } from "react-native";

export default function Home() {
    const { width } = useWindowDimensions();
    const { isLoaded, isSignedIn } = useAuth();
    const { user, loading, error, retryUser } = useAuthStore();

    const [galleryVisible, setGalleryVisible] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const galleryRef = useRef<FlatList<GalleryImage>>(null);
    const previewRef = useRef<FlatList<GalleryImage>>(null);

    const hasStoreMismatch = isLoaded && isSignedIn && !user;
    const galleryImages = user?.profile ? Array.from({ length: 6 }, (_, index) => ({ id: `${user.id}-profile-${index}`, uri: user.profile!, label: `Profile photo ${index + 1}` })) : [];

    if (!isLoaded || (!hasStoreMismatch && loading)) return <LoadingScreen />;

    if (hasStoreMismatch) return <MissMatch error={error} loading={loading} onPress={retryUser} />;

    if (!user) return <LoadingScreen />;

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

    const props = { galleryVisible, setGalleryVisible, galleryRef, galleryImages, activeImageIndex, handleGalleryScrollEnd, width, previewRef, jumpToImage };

    return (
        <>
            <Screen onTab className="items-center">
                {user.profile && (
                    <Pressable onPress={openGallery}>
                        <Image source={{ uri: user.profile }} accessibilityLabel={`${user.name} profile picture`} className="size-32 rounded-full" />
                    </Pressable>
                )}

                <Text className="h2">{user.name}</Text>
                <Text className="text-primary">@{user.username}</Text>
                {user.bio && <Text className="text-muted-foreground">{user.bio}</Text>}

                <NavLink href="/(drawer)/settings">Settings</NavLink>
            </Screen>

            <ImagePreview props={props} />
        </>
    );
}
