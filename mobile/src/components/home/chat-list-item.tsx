import { cn } from "@/lib/utils";
import { Link } from "expo-router";
import { RoomType } from "@/types/model";
import { Colors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "@/components/ui/display";

export type ChatListItemData = {
    id: string;
    title: string;
    preview: string;
    time: string;
    unread: number;
    kind: RoomType;
    online?: boolean;
};

interface ChatListItemProps {
    item: ChatListItemData;
    color: Colors;
}

export default function ChatListItem({ item, color }: ChatListItemProps) {
    const isGroup = item.kind === "Group";
    const { foreground } = color;
    const read = item.unread > 0;

    return (
        <Link href={`/(chat)/${item.id}`} className="h-14">
            <View className="flex-row gap-4">
                <View className={cn("relative size-14 items-center justify-center self-center rounded-full", isGroup ? "bg-primary/20" : "bg-muted")}>
                    <Ionicons name={isGroup ? "people" : "person"} size={20} color={foreground} />
                    <View className={cn(item.online ? "bg-success" : "bg-muted-foreground", "absolute right-1 bottom-1 size-2 rounded-full")} />
                </View>

                <View className="flex-1 justify-between">
                    <View className="row justify-between">
                        <Text className="text-[16px] font-extrabold">{item.title}</Text>
                        <View className="row gap-2">
                            <Ionicons name={read ? "checkmark-done" : "checkmark"} color={read ? color.success : color.destructive} size={16} />
                            <Text className="text-muted-foreground text-xs font-bold">{item.time}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-end justify-between">
                        <Text className="text-muted-foreground text-sm">{item.preview}</Text>

                        {read && (
                            <View className="relative items-center justify-center">
                                <Ionicons name="chatbubble" size={22} color={color.mutedForeground} />
                                <View className="absolute inset-0 items-center justify-center">
                                    <Text className="text-xs font-bold">{item.unread}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Link>
    );
}
