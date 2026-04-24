import { useAuth } from "@clerk/expo";
import useAuthStore from "@/store/auth-store";
import { Button } from "@/components/ui/interactive";
import { Screen, Text } from "@/components/ui/display";

export default function Settings() {
    const { clearUser } = useAuthStore();
    const { signOut } = useAuth();

    async function logout() {
        try {
            await signOut();
        } catch (e) {
            console.error("Sign‑out failed", e);
        }
    }

    return (
        <Screen onTab className="items-center justify-center gap-8">
            <Text className="h1">Settings</Text>

            <Button onPress={logout} variant="primary">
                Sign out
            </Button>

            <Button onPress={clearUser} variant="primary">
                Clear User
            </Button>
        </Screen>
    );
}
