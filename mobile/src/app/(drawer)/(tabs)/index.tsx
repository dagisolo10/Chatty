import { Image } from "react-native";
import { useAuth } from "@clerk/expo";
import useAuthStore from "@/store/auth-store";
import { Screen, Text, View } from "@/components/ui/display";
import { Button, NavLink } from "@/components/ui/interactive";
import { ErrorMessage, LoadingScreen } from "@/components/ui/screen-ui";

export default function Home() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user, loading, error, retryUser } = useAuthStore();

    const hasStoreMismatch = isLoaded && isSignedIn && !user;

    if (!isLoaded || (!hasStoreMismatch && loading)) return <LoadingScreen />;

    if (hasStoreMismatch) return <MissMatch error={error} loading={loading} onPress={retryUser} />;

    if (!user) return <LoadingScreen />;

    return (
        <Screen onTab className="items-center justify-center">
            {user.profile && <Image source={{ uri: user.profile }} accessibilityLabel={`${user.name} profile picture`} className="size-36 rounded-full" />}

            <Text className="h1">Welcome</Text>

            <Text className="h2">{user.name}</Text>

            <Text className="">{user.username}</Text>

            {user.bio && <Text>{user.bio}</Text>}

            <NavLink href="/(drawer)/settings">Settings</NavLink>
        </Screen>
    );
}

function MissMatch({ error, loading, onPress }: { error: string | null; loading: boolean; onPress: () => void }) {
    return (
        <Screen onTab noSafeArea className="items-center justify-center gap-4 px-6">
            <Text className="h2 text-center">We could not finish loading your profile.</Text>
            <Text className="text-muted-foreground text-center">Retry syncing your account, or continue to onboarding if your profile has not been created yet.</Text>
            <ErrorMessage message={error || "Your Clerk session is active, but your app profile is missing."} />

            <View className="w-full gap-3">
                <Button onPress={onPress} disabled={loading}>
                    Retry sync
                </Button>
                <NavLink href="/(onboarding)/onboarding" variant="outline">
                    Complete profile
                </NavLink>
            </View>
        </Screen>
    );
}
