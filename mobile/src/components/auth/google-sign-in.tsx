import GoogleIcon from "../icons/google";
import { Button } from "../ui/interactive";
import { View, Text } from "../ui/display";

import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";
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
            if (err.code === "SIGN_IN_CANCELLED" || err.code === "-5") return;

            Alert.alert("Error", err.message || "An error occurred during Google sign-in");
            console.error("Sign in with Google error:", JSON.stringify(err.message, null, 2));
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
