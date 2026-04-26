import { useAuth } from "@clerk/expo";
import { ChatFilter } from "@/types/ui";
import { mockChats } from "@/mocks/chats";
import useAuthStore from "@/store/auth-store";
import useThemeColors from "@/hooks/use-colors";
import { Screen } from "@/components/ui/display";
import { useMemo, useState, useEffect } from "react";
import SearchBar from "@/components/home/search-bar";
import ChatFilters from "@/components/home/chat-filters";
import ChatEmptyState from "@/components/home/chat-empty-state";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingScreen, MisMatch } from "@/components/ui/screen-ui";
import ChatListItem, { ChatListItemData } from "@/components/home/chat-list-item";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";

let chromeInitialized = false;

export default function Home() {
    const color = useThemeColors();
    const insets = useSafeAreaInsets();
    const { isLoaded, isSignedIn } = useAuth();
    const { user, loading, error, retryUser } = useAuthStore();

    const [activeFilter, setActiveFilter] = useState<ChatFilter>("All");

    const [query, setQuery] = useState("");

    const filterVisibility = useSharedValue(1);
    const searchVisibility = useSharedValue(1);
    const chromeOpacity = useSharedValue(chromeInitialized ? 1 : 0);

    useEffect(() => {
        if (!chromeInitialized) {
            chromeOpacity.value = withTiming(1, { duration: 300 });
            chromeInitialized = true;
        }
    }, [chromeOpacity]);

    const previousOffset = useSharedValue(0);

    const chats = useMemo<ChatListItemData[]>(() => mockChats(), []);
    const filteredChats = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return chats.filter((chat) => {
            const matchesFilter = activeFilter === "All" ? true : chat.kind === activeFilter;
            const matchesQuery = normalizedQuery ? `${chat.title} ${chat.preview}`.toLowerCase().includes(normalizedQuery) : true;
            return matchesFilter && matchesQuery;
        });
    }, [activeFilter, chats, query]);

    const searchBarAnimatedStyle = useAnimatedStyle(() => ({
        opacity: searchVisibility.value,
        transform: [{ translateY: interpolate(searchVisibility.value, [0, 1], [-18, 0], Extrapolation.CLAMP) }],
    }));

    const filtersAnimatedStyle = useAnimatedStyle(() => ({
        opacity: filterVisibility.value,
        height: interpolate(filterVisibility.value, [0, 1], [0, 52], Extrapolation.CLAMP),
        marginTop: interpolate(filterVisibility.value, [0, 1], [0, 12], Extrapolation.CLAMP),
        transform: [{ translateY: interpolate(filterVisibility.value, [0, 1], [-16, 0], Extrapolation.CLAMP) }],
    }));

    const chromeAnimatedStyle = useAnimatedStyle(() => ({
        opacity: chromeOpacity.value,
        transform: [{ translateY: interpolate(chromeOpacity.value, [0, 1], [20, 0], Extrapolation.CLAMP) }],
    }));

    const animatedProps = useAnimatedProps(() => ({
        contentContainerStyle: {
            gap: 32,
            paddingBottom: 24,
            paddingTop: interpolate(filterVisibility.value, [0, 1], [insets.top + 41, insets.top + 105], Extrapolation.CLAMP),
        },
    }));

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            const offsetY = event.contentOffset.y;
            const delta = offsetY - previousOffset.value;

            if (offsetY <= 8) {
                searchVisibility.value = withTiming(1, { duration: 180 });
                filterVisibility.value = withTiming(1, { duration: 180 });
            } else if (delta > 6) {
                searchVisibility.value = withTiming(0, { duration: 180 });
                filterVisibility.value = withTiming(0, { duration: 180 });
            } else if (delta < -6) {
                searchVisibility.value = withTiming(1, { duration: 180 });
                filterVisibility.value = withTiming(1, { duration: 180 });
            }

            previousOffset.value = offsetY;
        },
    });

    const hasStoreMismatch = isLoaded && isSignedIn && !user && !loading;
    if (!isLoaded || (!hasStoreMismatch && loading)) return <LoadingScreen />;

    if (hasStoreMismatch) return <MisMatch error={error} loading={loading} onPress={retryUser} />;

    if (!user) return <LoadingScreen />;

    return (
        <Screen nonScrollable noSafeArea className="pb-0">
            <Animated.View style={[{ paddingTop: insets.top + 16 }, chromeAnimatedStyle]} className="absolute top-0 right-0 left-0 z-20 gap-2 px-4">
                <SearchBar query={query} setQuery={setQuery} color={color} animatedStyle={searchBarAnimatedStyle} />
                <ChatFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} animatedStyle={filtersAnimatedStyle} />
            </Animated.View>

            <Animated.FlatList
                onScroll={onScroll}
                data={filteredChats}
                scrollEventThrottle={16}
                animatedProps={animatedProps}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<ChatEmptyState color={color} />}
                renderItem={({ item }) => <ChatListItem item={item} color={color} />}
            />
        </Screen>
    );
}

// TODO fix the animated flat-list
