import { useClerk } from "@clerk/expo";
import useAuthStore from "@/store/auth-store";
import { Button } from "@/components/ui/interactive";
import { Screen, Text } from "@/components/ui/display";

export default function Settings() {
    const { clearUser } = useAuthStore();
    const { signOut } = useClerk();

    async function logout() {
        await signOut();
        clearUser();
    }

    return (
        <Screen noSafeArea onTab className="items-center justify-center">
            <Text className="h1">Settings</Text>

            <Button onPress={logout} variant="outline">
                Sign out
            </Button>
        </Screen>
    );
}
