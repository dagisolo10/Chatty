import { Screen, Text } from "@/components/ui/display";

export default function Home() {
    return (
        <Screen onTab noSafeArea className="items-center justify-center">
            <Text className="h1">Home</Text>
        </Screen>
    );
}
