import { Button } from "@/components/ui/interactive";
import { Card, Text } from "@/components/ui/display";

interface MenuProp {
    tag: "chat" | "details";
    show: boolean;
}

export function Menu({ show, tag }: MenuProp) {
    if (!show) return null;

    const onChat = tag === "chat";

    return (
        <Card className="absolute top-0 right-4 z-10 items-start gap-2 rounded-xl p-2">
            {onChat && (
                <Button variant="ghost" size="sm" onPress={() => console.log("Go to first message")} component>
                    <Text>Go to first message</Text>
                </Button>
            )}
            <Button variant="ghost" size="sm" onPress={() => console.log("Clear history")} component>
                <Text>Clear history</Text>
            </Button>
            <Button variant="ghost" size="sm" onPress={() => console.log("Delete chat")} component>
                <Text>Delete chat</Text>
            </Button>
            <Button variant="ghost" size="sm" onPress={() => console.log("Muted")} component>
                <Text>Muted</Text>
            </Button>
        </Card>
    );
}
