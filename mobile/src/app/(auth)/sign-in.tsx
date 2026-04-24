import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/expo";
import useThemeColors from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import { getClerkError } from "@/lib/helper-functions";
import { ErrorMessage } from "@/components/ui/screen-ui";
import { Text, Screen, View } from "@/components/ui/display";
import { Mail, EyeOff, Eye, Lock } from "lucide-react-native";
import { Button, Input, NavLink } from "@/components/ui/interactive";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";

const token = process.env.EXPO_PUBLIC_TOKEN!;

if (!token) throw new Error("Add token to the .env file");

export default function SignIn() {
    const router = useRouter();
    const { mutedForeground, opaqueDestructive } = useThemeColors();
    const { signIn, errors, fetchStatus } = useSignIn();

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [password, setPassword] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

    const handleSignIn = async () => {
        if (isSigningIn) return;

        setIsSigningIn(true);
        setError(null);

        try {
            const { error } = await signIn.password({ emailAddress, password });

            if (error) return setError(getClerkError(error));

            if (signIn.status === "complete") {
                await signIn.finalize({
                    navigate: ({ session }) => {
                        if (session?.currentTask) {
                            setError(`Additional task required: ${session.currentTask}`);
                            return;
                        }
                    },
                });
            } else if (signIn.status === "needs_second_factor") {
                const emailCodeFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === "email_code");
                const phoneCodeFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === "phone_code");

                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode();
                    router.push("/(auth)/verification?type=sign-in&mode=second-factor&strategy=email_code");
                } else if (phoneCodeFactor) {
                    await signIn.mfa.sendPhoneCode();
                    router.push("/(auth)/verification?type=sign-in&mode=second-factor&strategy=phone_code");
                } else {
                    router.push("/(auth)/verification?type=sign-in&mode=second-factor&strategy=totp");
                }
            } else {
                setError(`Sign-in requires additional steps: ${signIn.status}`);
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const inputErrStyle = {
        email: errors.fields.identifier ? "border-destructive/70 border" : "",
        password: errors.fields.password ? "border-destructive/70 border" : "",
    };
    const iconErrStyle = {
        email: errors.fields.identifier ? opaqueDestructive : mutedForeground,
        password: errors.fields.password ? opaqueDestructive : mutedForeground,
    };

    return (
        <Screen noSafeArea onTab className="justify-center gap-4">
            <View>
                <Text className="h1">Login to Your</Text>
                <Text className="h1">Account</Text>
            </View>

            <View className="relative">
                <Input className={cn("pl-14", inputErrStyle.email)} value={emailAddress} onChangeText={setEmailAddress} placeholder="name@domain.com" autoCapitalize="none" />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Mail color={iconErrStyle.email} size={18} />
                </View>
            </View>

            <View className="relative">
                <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 8 characters"
                    secureTextEntry={!passwordVisible}
                    className={cn("pl-14", inputErrStyle.password)}
                />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Lock color={iconErrStyle.password} size={18} />
                </View>

                <Button
                    size={"icon"}
                    variant={"ghost"}
                    className={cn(password ? "block" : "hidden", "absolute top-1/2 right-2 -translate-y-1/2")}
                    onPress={() => setPasswordVisible((visible) => !visible)}
                >
                    {passwordVisible ? <EyeOff color={mutedForeground} size={16} /> : <Eye color={mutedForeground} size={16} />}
                </Button>
            </View>

            <ErrorMessage message={error || errors.fields.identifier?.message || errors.fields.password?.message} />

            <View className="gap-2">
                <Button onPress={handleSignIn} variant="secondary" disabled={!emailAddress || !password || fetchStatus === "fetching" || isSigningIn} component>
                    <View className="row gap-4">
                        {isSigningIn && <ActivityIndicator color={"#ffffff"} />}
                        <Text className="text-xl font-bold">Login</Text>
                    </View>
                </Button>

                <NavLink href={"/(auth)/forgot-password"}>Forgot Password?</NavLink>
            </View>

            <View className="gap-2">
                <GoogleSignInButton />

                <View className="row gap-2 self-center">
                    <Text className="text-muted-foreground">Don&apos;t have an account?</Text>
                    <NavLink href="/(auth)/sign-up">Sign Up</NavLink>
                </View>
            </View>
        </Screen>
    );
}
