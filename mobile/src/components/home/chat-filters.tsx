import { cn } from "@/lib/utils";
import { ChatFilter } from "@/types/ui";
import { View } from "@/components/ui/display";
import Animated from "react-native-reanimated";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/interactive";

interface ChatFiltersProps {
    activeFilter: ChatFilter;
    setActiveFilter: Dispatch<SetStateAction<ChatFilter>>;
    animatedStyle: React.ComponentProps<typeof Animated.View>["style"];
}

const filters: { key: ChatFilter; label: string }[] = [
    { key: "All", label: "All Chats" },
    { key: "Private", label: "Users" },
    { key: "Group", label: "Groups" },
];

export default function ChatFilters({ activeFilter, setActiveFilter, animatedStyle }: ChatFiltersProps) {
    return (
        <Animated.View style={animatedStyle} className="overflow-hidden">
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
