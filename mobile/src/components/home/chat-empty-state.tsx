import { Colors } from "@/hooks/use-colors";
import { Text, View } from "@/components/ui/display";

interface ChatEmptyStateProps {
    color: Colors;
}

export default function ChatEmptyState({ color }: ChatEmptyStateProps) {
    const { card, border, mutedForeground } = color;
    return (
        <View className="items-center justify-center px-0 py-12">
            <View style={{ backgroundColor: card, borderColor: border }} className="w-full rounded-[28px] border px-6 py-8">
                <Text className="text-center text-xl font-bold">No chats found</Text>
                <Text className="mt-2 text-center text-sm font-medium" style={{ color: mutedForeground }}>
                    Try another search or switch to a different chat filter.
                </Text>
            </View>
        </View>
    );
}
