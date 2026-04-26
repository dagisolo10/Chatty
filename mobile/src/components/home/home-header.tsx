import { cn } from "@/lib/utils";
import { ChatFilter } from "@/types/ui";
import { Colors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "@/components/ui/display";
import Animated from "react-native-reanimated";
import { Dispatch, SetStateAction } from "react";
import { Button, Input } from "@/components/ui/interactive";
import DrawerToggle from "@/components/drawer/custom-drawer-toggle";

interface ChatFiltersProps {
    activeFilter: ChatFilter;
    setActiveFilter: Dispatch<SetStateAction<ChatFilter>>;
    animatedStyle: React.ComponentProps<typeof Animated.View>["style"];
}

interface SearchBarProps {
    query: string;
    color: Colors;
    setQuery: Dispatch<SetStateAction<string>>;
    animatedStyle: React.ComponentProps<typeof Animated.View>["style"];
}

const filters: { key: ChatFilter; label: string }[] = [
    { key: "All", label: "All Chats" },
    { key: "Private", label: "Users" },
    { key: "Group", label: "Groups" },
];

export default function Header({ query, setQuery, color, animatedStyle, activeFilter, setActiveFilter }: ChatFiltersProps & SearchBarProps) {
    return (
        <Animated.View style={animatedStyle} className="gap-4">
            <View className="flex-row items-center gap-3">
                <DrawerToggle />

                <View className="relative flex-1">
                    <Input
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search chats"
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                        accessibilityLabel="Search chats"
                        className="h-11 rounded-full border px-4 pl-11"
                    />
                    <View className="absolute top-1/2 left-4 -translate-y-1/2">
                        <Ionicons name="search" size={16} color={color.primary} />
                    </View>
                    {query && (
                        <Button onPress={() => setQuery("")} variant={"ghost"} size={"content"} className="absolute top-1/2 right-4 -translate-y-1/2">
                            <Ionicons name="close" size={20} color={color.mutedForeground} />
                        </Button>
                    )}
                </View>
            </View>

            <View className="flex-row items-center gap-4 px-12">
                {filters.map((filter) => (
                    <Button
                        key={filter.key}
                        onPress={() => setActiveFilter(filter.key)}
                        variant={filter.key === activeFilter ? "primary" : "outline"}
                        className={cn("h-10 flex-1 rounded-full")}
                        textClassName={cn(filter.key === activeFilter ? "text-foreground" : "text-muted-foreground", "text-sm font-bold")}
                    >
                        {filter.label}
                    </Button>
                ))}
            </View>
        </Animated.View>
    );
}
