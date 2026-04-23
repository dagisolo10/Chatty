import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "expo-router";
import Skeleton from "@/components/ui/skeleton";
import { ActivityIndicator } from "react-native";
import { useAuth, useSignUp } from "@clerk/expo";
import { ErrorMessage } from "@/components/ui/screen-ui";
import { Text, Screen, View } from "@/components/ui/display";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { Button, Input, NavLink } from "@/components/ui/interactive";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import PasswordRequirements from "@/components/auth/password-requirement";

const token = process.env.EXPO_PUBLIC_TOKEN!;

if (!token) throw new Error("Add token to the .env file");

export default function SignUp() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { signUp, errors, fetchStatus } = useSignUp();

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [password, setPassword] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const isPasswordDirty = password.length > 0;
    const [submitted, setSubmitted] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({ oneSpecialCharErr: false, passwordLengthErr: false, atLeastOneNumberErr: false });

    const passwordError = passwordRequirements.atLeastOneNumberErr || passwordRequirements.oneSpecialCharErr || passwordRequirements.passwordLengthErr;

    async function handleSignUp() {
        setSubmitted(true);
        setError(null);

        if (passwordError || !emailAddress) return;

        setIsSigningUp(true);
        if (isSigningUp) return;

        try {
            const { error } = await signUp.password({ emailAddress, password });
            if (error) return setError(JSON.stringify(error, null, 4));
            if (!error) await signUp.verifications.sendEmailCode();
            router.push("/(auth)/verification?type=sign-up");
        } finally {
            setIsSigningUp(false);
        }
    }

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        setSubmitted(false);
        setPasswordRequirements({
            passwordLengthErr: val.length < 8,
            atLeastOneNumberErr: !/\d/.test(val),
            oneSpecialCharErr: !/[!@#$%^&*(),.?":{}|<>]/.test(val),
        });
    };

    if (signUp.status === "complete" || !isSignedIn) return <Skeleton />;

    if (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address") && signUp.missingFields.length === 0) return router.push("/(auth)/verification?type=sign-up");

    return (
        <Screen noSafeArea onTab className="justify-center gap-8">
            <View>
                <Text className="h1">Create Your</Text>
                <Text className="h1">Account</Text>
            </View>

            <View className="relative">
                <Input className={cn("pl-14", !true ? "border-destructive/70 border" : "")} value={emailAddress} onChangeText={setEmailAddress} placeholder="name@domain.com" autoCapitalize="none" />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Mail color={!true ? "#e35454bf" : "#73738c"} size={18} />
                </View>
            </View>

            <ErrorMessage message={errors.fields.emailAddress?.message} />

            <View className="relative">
                <Input className={cn("pl-14", passwordError && isPasswordDirty && submitted ? "border-destructive/70 border" : "")} value={password} onChangeText={(val) => handlePasswordChange(val)} placeholder="Min. 8 characters" secureTextEntry={!passwordVisible} />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Lock color={passwordError && isPasswordDirty && submitted ? "#e35454bf" : "#73738c"} size={18} />
                </View>

                <Button className={cn(password ? "block" : "hidden", "absolute top-1/2 right-2 -translate-y-1/2")} variant={"ghost"} size={"icon"} onPress={() => setPasswordVisible((visible) => !visible)}>
                    {passwordVisible ? <EyeOff color={"#73738c"} size={16} /> : <Eye color={"#73738c"} size={16} />}
                </Button>
            </View>

            <ErrorMessage message={errors.fields.password?.message} />

            <ErrorMessage message={error} />

            <PasswordRequirements value={password} isPasswordDirty={isPasswordDirty} passwordRequirements={passwordRequirements} submitted={submitted} />

            <Button onPress={handleSignUp} variant="secondary" disabled={!emailAddress || !password || fetchStatus === "fetching" || isSigningUp} component>
                <View className="row gap-4">
                    {isSigningUp && <ActivityIndicator color={"#ffffff"} />}
                    <Text className="gap-4 text-xl font-bold">Create Account</Text>
                </View>
            </Button>

            <View className="gap-2">
                <GoogleSignInButton />

                <View className="row gap-2 self-center">
                    <Text className="text-muted-foreground">Already have an account?</Text>
                    <NavLink href="/(auth)/sign-in">Sign In</NavLink>

                    <NavLink href="/(auth)/verification">Verification</NavLink>
                </View>
            </View>
        </Screen>
    );
}
