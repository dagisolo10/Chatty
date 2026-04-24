import { Button } from "@/components/ui/interactive";
import { Text, View } from "@/components/ui/display";
import { Dispatch, RefObject, SetStateAction } from "react";
import { FlatList, Image, Modal, Pressable } from "react-native";

type GalleryImage = {
    id: string;
    uri: string;
    label: string;
};

interface Prop {
    props: {
        width: number;
        galleryVisible: boolean;
        activeImageIndex: number;
        jumpToImage: (index: number) => void;
        handleGalleryScrollEnd: (offsetX: number) => void;
        previewRef: RefObject<FlatList<GalleryImage> | null>;
        galleryRef: RefObject<FlatList<GalleryImage> | null>;
        setGalleryVisible: Dispatch<SetStateAction<boolean>>;
        galleryImages: { id: string; uri: string; label: string }[];
    };
}

export default function ImagePreview({ props }: Prop) {
    const { galleryVisible, setGalleryVisible, galleryRef, galleryImages, activeImageIndex, handleGalleryScrollEnd, width, previewRef, jumpToImage } = props;
    return (
        <Modal visible={galleryVisible} animationType="fade" statusBarTranslucent onRequestClose={() => setGalleryVisible(false)}>
            <View className="flex-1 bg-black">
                <View className="absolute top-14 right-6 z-10">
                    <Button onPress={() => setGalleryVisible(false)} variant="ghost" className="rounded-full bg-black/40 px-4">
                        Close
                    </Button>
                </View>

                <FlatList
                    horizontal
                    pagingEnabled
                    ref={galleryRef}
                    data={galleryImages}
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={activeImageIndex}
                    keyExtractor={(item) => item.id}
                    onMomentumScrollEnd={(event) => handleGalleryScrollEnd(event.nativeEvent.contentOffset.x)}
                    getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                    renderItem={({ item }) => (
                        <View style={{ width }} className="">
                            <Image source={{ uri: item.uri }} resizeMode="contain" className="size-full" accessibilityLabel={item.label} />
                        </View>
                    )}
                />

                <View className="absolute right-0 bottom-0 left-0 gap-3 bg-black/80 px-4 pt-4 pb-12">
                    <Text className="text-center text-sm font-bold text-white/70">
                        {activeImageIndex + 1} / {galleryImages.length}
                    </Text>

                    <FlatList
                        ref={previewRef}
                        data={galleryImages}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
                        keyExtractor={(item) => `${item.id}-preview`}
                        getItemLayout={(_, index) => ({ length: 84, offset: 84 * index, index })}
                        renderItem={({ item, index }) => {
                            const isActive = index === activeImageIndex;

                            return (
                                <Pressable onPress={() => jumpToImage(index)} className="overflow-hidden rounded-2xl">
                                    <Image source={{ uri: item.uri }} accessibilityLabel={`${item.label} preview`} className="size-18 rounded-2xl" style={{ opacity: isActive ? 1 : 0.45, borderWidth: isActive ? 1 : 0, borderColor: "#73738c" }} />
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
}
