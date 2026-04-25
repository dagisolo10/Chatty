import { cn } from "@/lib/utils";
import { ChatFilter } from "@/types/ui";
import Animated from "react-native-reanimated";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/interactive";
import { Text, View } from "@/components/ui/display";

interface ChatFiltersProps {
    activeFilter: ChatFilter;
    setActiveFilter: Dispatch<SetStateAction<ChatFilter>>;
    animatedStyle: React.ComponentProps<typeof Animated.View>["style"];
}

const FILTERS: { key: ChatFilter; label: string }[] = [
    { key: "All", label: "All Chats" },
    { key: "Private", label: "Users" },
    { key: "Group", label: "Groups" },
];

export default function ChatFilters({ activeFilter, setActiveFilter, animatedStyle }: ChatFiltersProps) {
    return (
        <Animated.View style={animatedStyle} className="overflow-hidden">
            <View className="flex-row items-center gap-2">
                {FILTERS.map((filter) => {
                    const isActive = filter.key === activeFilter;

                    return (
                        <Button
                            component
                            key={filter.key}
                            onPress={() => setActiveFilter(filter.key)}
                            className={cn(
                                "h-10 flex-1 items-center justify-center rounded-full border",
                                isActive ? "border-primary bg-primary" : "border-border bg-muted",
                            )}
                        >
                            <Text className={cn(isActive ? "text-foreground" : "text-muted-foreground", "text-sm font-bold")}>{filter.label}</Text>
                        </Button>
                    );
                })}
            </View>
        </Animated.View>
    );
}
