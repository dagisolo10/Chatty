import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/hooks/use-colors";
import { Button } from "@/components/ui/interactive";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function DrawerToggle({ alone = false }: { alone?: boolean }) {
    const color = useThemeColors();
    const navigation = useNavigation();

    return (
        <Button
            component
            size="icon"
            variant="outline"
            accessibilityRole="button"
            accessibilityLabel="Toggle drawer"
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            className={cn("bg-muted size-11 rounded-full", alone ? "mt-2 ml-4" : "")}
        >
            <Ionicons name="menu" size={20} color={color.foreground} />
        </Button>
    );
}
