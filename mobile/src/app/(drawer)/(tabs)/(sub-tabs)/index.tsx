import { useAuth } from "@clerk/expo";
import { ChatFilter } from "@/types/ui";
import { useMemo, useState } from "react";
import useAuthStore from "@/store/auth-store";
import useThemeColors from "@/hooks/use-colors";
import { Screen } from "@/components/ui/display";
import SearchBar from "@/components/home/search-bar";
import ChatFilters from "@/components/home/chat-filters";
import ChatEmptyState from "@/components/home/chat-empty-state";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingScreen, MissMatch } from "@/components/ui/screen-ui";
import ChatListItem, { ChatListItemData } from "@/components/home/chat-list-item";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function Home() {
    const color = useThemeColors();
    const insets = useSafeAreaInsets();
    const { isLoaded, isSignedIn } = useAuth();
    const { user, loading, error, retryUser } = useAuthStore();

    const [activeFilter, setActiveFilter] = useState<ChatFilter>("All");

    const [query, setQuery] = useState("");

    const filterVisibility = useSharedValue(1);
    const searchVisibility = useSharedValue(1);

    const previousOffset = useSharedValue(0);
    const userName = user?.name ?? "Saved messages";

    const chats = useMemo<ChatListItemData[]>(
        () => [
            {
                id: "chat-1",
                title: "Design sync",
                preview: "The new drawer transition feels a lot smoother now.",
                time: "09:42",
                unread: 3,
                kind: "Group",
            },
            {
                id: "chat-2",
                title: "Marta Benson",
                preview: "Can you send the latest build after standup?",
                time: "08:10",
                unread: 1,
                kind: "Private",
                online: true,
            },
            {
                id: "chat-3",
                title: "Frontend guild",
                preview: "Pinned the notes from yesterday's navigation review.",
                time: "12:30",
                unread: 0,
                kind: "Group",
            },
            {
                id: "chat-4",
                title: userName,
                preview: "Your saved messages are ready for quick access.",
                time: "02:23",
                unread: 0,
                kind: "Private",
            },
            {
                id: "chat-5",
                title: "Nina James",
                preview: "Private chats now inherit the new theme colors.",
                time: "Mon",
                unread: 7,
                kind: "Private",
                online: false,
            },
            {
                id: "chat-6",
                title: "Weekend plans",
                preview: "Group call moved to 7:30 PM.",
                time: "Mon",
                unread: 0,
                kind: "Group",
            },
            {
                id: "chat-7",
                title: "Design sync",
                preview: "The new drawer transition feels a lot smoother now.",
                time: "09:42",
                unread: 3,
                kind: "Group",
            },
            {
                id: "chat-8",
                title: "Marta Benson",
                preview: "Can you send the latest build after standup?",
                time: "08:10",
                unread: 1,
                kind: "Private",
                online: true,
            },
            {
                id: "chat-9",
                title: "Frontend guild",
                preview: "Pinned the notes from yesterday's navigation review.",
                time: "21:45",
                unread: 0,
                kind: "Group",
            },
            {
                id: "chat-10",
                title: userName,
                preview: "Your saved messages are ready for quick access.",
                time: "10:00",
                unread: 0,
                kind: "Private",
            },
            {
                id: "chat-11",
                title: "Nina James",
                preview: "Private chats now inherit the new theme colors.",
                time: "Mon",
                unread: 7,
                kind: "Private",
                online: false,
            },
            {
                id: "chat-12",
                title: "Weekend plans",
                preview: "Group call moved to 7:30 PM.",
                time: "Mon",
                unread: 0,
                kind: "Group",
            },
        ],
        [userName],
    );

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

    const topChromeHeight = insets.top + 105;

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            const offsetY = event.contentOffset.y;
            const delta = offsetY - previousOffset.value;

            if (offsetY <= 8) {
                searchVisibility.value = withTiming(1, { duration: 180 });
                filterVisibility.value = withTiming(1, { duration: 180 });
            } else if (delta > 6) {
                searchVisibility.value = withTiming(1, { duration: 180 });
                filterVisibility.value = withTiming(0, { duration: 180 });
            } else if (delta < -6) {
                searchVisibility.value = withTiming(0, { duration: 180 });
                filterVisibility.value = withTiming(1, { duration: 180 });
            }

            previousOffset.value = offsetY;
        },
    });

    const hasStoreMismatch = isLoaded && isSignedIn && !user;
    if (!isLoaded || (!hasStoreMismatch && loading)) return <LoadingScreen />;

    if (hasStoreMismatch) return <MissMatch error={error} loading={loading} onPress={retryUser} />;

    if (!user) return <LoadingScreen />;

    return (
        <Screen nonScrollable noSafeArea className="flex-1 pb-0">
            <Animated.View style={[{ paddingTop: insets.top + 16 }]} className="absolute top-0 right-0 left-0 z-20 gap-2 px-4">
                <SearchBar query={query} setQuery={setQuery} color={color} animatedStyle={searchBarAnimatedStyle} />

                <ChatFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} mutedForeground={color.mutedForeground} animatedStyle={filtersAnimatedStyle} />
            </Animated.View>

            <Animated.FlatList
                data={filteredChats}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: topChromeHeight, gap: 32, paddingBottom: 24 }}
                ListEmptyComponent={<ChatEmptyState card={color.card} border={color.border} mutedForeground={color.mutedForeground} />}
                renderItem={({ item }) => <ChatListItem item={item} color={color} />}
            />
        </Screen>
    );
}
