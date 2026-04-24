import { useClerk } from "@clerk/expo";
import { Button } from "@/components/ui/interactive";
import { Screen, Text } from "@/components/ui/display";

export default function Settings() {
    const { signOut } = useClerk();

    async function logout() {
        try {
            await signOut();
        } catch (e) {
            console.error("Sign‑out failed", e);
        }
    }

    return (
        <Screen noSafeArea onTab className="items-center">
            <Text className="h1">Settings</Text>

            <Button onPress={logout} variant="outline">
                Sign out
            </Button>
        </Screen>
    );
}
