import { Colors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "@/components/ui/display";
import Animated from "react-native-reanimated";
import { Dispatch, SetStateAction } from "react";
import { Button, Input } from "@/components/ui/interactive";
import { DrawerActions, NavigationProp, NavigationState, useNavigation } from "@react-navigation/native";

interface SearchBarProps {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    color: Colors;
    animatedStyle: React.ComponentProps<typeof Animated.View>["style"];
}

type RootNavigation = Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
    getState(): NavigationState | undefined;
};

export default function SearchBar({ query, setQuery, color, animatedStyle }: SearchBarProps) {
    const navigation = useNavigation<RootNavigation>();

    return (
        <Animated.View style={animatedStyle}>
            <View className="flex-row items-center gap-3">
                <Button component size="icon" variant="outline" accessibilityRole="button" accessibilityLabel="Toggle drawer" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} className="bg-muted size-11 rounded-full">
                    <Ionicons name="menu" size={20} color={color.foreground} />
                </Button>

                <View className="relative flex-1">
                    <Input value={query} onChangeText={setQuery} placeholder="Search chats" className="h-11 rounded-full border px-4 pl-11" />
                    <View className="absolute top-1/2 left-4 -translate-y-1/2">
                        <Ionicons name="search" size={16} color={color.primary} />
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
