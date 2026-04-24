import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/interactive";
import { View, Text } from "@/components/ui/display";
import { useSignInWithGoogle } from "@clerk/expo/google";

interface GoogleSignInButtonProps {
    onSignInComplete?: () => void;
}

export function GoogleSignInButton({ onSignInComplete }: GoogleSignInButtonProps) {
    const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
    const router = useRouter();

    if (Platform.OS !== "ios" && Platform.OS !== "android") {
        return null;
    }

    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startGoogleAuthenticationFlow();

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });

                if (onSignInComplete) {
                    onSignInComplete();
                } else {
                    router.replace("/");
                }
            }
        } catch (err: any) {
            const code = (err as { code?: string })?.code;
            if (code === "SIGN_IN_CANCELLED" || code === "-5") return;

            const message = err instanceof Error ? err.message : "An error occurred during Google sign-in";
            Alert.alert("Error", message);
            console.error("Sign in with Google error:", err);
        }
    };

    return (
        <View className="gap-4">
            <View className="row gap-4">
                <View className="bg-border h-px flex-1 rounded-full" />
                <Text className="text-muted-foreground text-xs tracking-[2px] uppercase">or continue with</Text>
                <View className="bg-border h-px flex-1 rounded-full" />
            </View>

            <Button onPress={handleGoogleSignIn} variant="ghost" size={"icon"} className="self-center" component>
                <GoogleIcon />
            </Button>
        </View>
    );
}
