import { Colors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "@/components/ui/display";
import { Input } from "@/components/ui/interactive";

interface SearchBarProp {
    color: Colors;
    query: string;
    showSearch: boolean;
    setShowSearch: () => void;
    setQuery: (val: string) => void;
}

export default function ChatSearchBar({ showSearch, setShowSearch, color, query, setQuery }: SearchBarProp) {
    if (!showSearch) return null;

    return (
        <View className="flex-row items-center gap-3">
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
            </View>
        </View>
    );
}
