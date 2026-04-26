import useTheme from "@/store/theme-store";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { Button } from "@/components/ui/interactive";
import { Text, View } from "@/components/ui/display";

export default function DrawerThemeToggle() {
    const { isDark, toggle } = useTheme();
    const { foreground } = useThemeColors();

    return (
        <View className="bg-muted mt-4 flex-row items-center justify-between rounded-4xl border px-5 py-4">
            <View className="flex-row items-center gap-3">
                <View className="size-11 items-center justify-center rounded-full bg-white/10">
                    <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={foreground} />
                </View>
                <View>
                    <Text className="text-base font-bold">{isDark ? "Night Mode" : "Day Mode"}</Text>
                    <Text className="text-muted-foreground text-sm font-medium">Switch the chat theme</Text>
                </View>
            </View>

            <Button
                component
                onPress={toggle}
                variant={"ghost"}
                accessibilityRole="switch"
                accessibilityState={{ checked: isDark }}
                accessibilityLabel={isDark ? "Disable night mode" : "Enable night mode"}
                className="p-0"
            >
                <View className="dark:bg-drawer h-8 w-14 justify-center rounded-full bg-white px-1">
                    <View className="size-6 self-start rounded-full bg-[#cbd5e1] dark:self-end" />
                </View>
            </Button>
        </View>
    );
}
