import DrawerToggle from "../drawer/custom-drawer-toggle";

import { Colors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "@/components/ui/display";
import Animated from "react-native-reanimated";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/interactive";

interface SearchBarProps {
    query: string;
    color: Colors;
    setQuery: Dispatch<SetStateAction<string>>;
    animatedStyle: React.ComponentProps<typeof Animated.View>["style"];
}

export default function SearchBar({ query, setQuery, color, animatedStyle }: SearchBarProps) {
    return (
        <Animated.View style={animatedStyle}>
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
                </View>
            </View>
        </Animated.View>
    );
}
