import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/skeleton";
import useThemeColors from "@/hooks/use-colors";
import { ActivityIndicator } from "react-native";
import { useAuth, useSignUp } from "@clerk/expo";
import { validatePassword } from "@/lib/password";
import { getClerkError } from "@/lib/helper-functions";
import { ErrorMessage } from "@/components/ui/screen-ui";
import { Text, Screen, View } from "@/components/ui/display";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { Button, Input, NavLink } from "@/components/ui/interactive";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import PasswordRequirements from "@/components/auth/password-requirement";

const token = process.env.EXPO_PUBLIC_TOKEN!;

if (!token) throw new Error("Add token to the .env file");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { mutedForeground, opaqueDestructive } = useThemeColors();
    const { signUp, errors, fetchStatus } = useSignUp();

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [password, setPassword] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const isPasswordDirty = password.length > 0;
    const [submitted, setSubmitted] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({ oneSpecialCharErr: false, passwordLengthErr: false, atLeastOneNumberErr: false });

    const emailError = submitted && !EMAIL_REGEX.test(emailAddress);
    const passwordError = passwordRequirements.atLeastOneNumberErr || passwordRequirements.oneSpecialCharErr || passwordRequirements.passwordLengthErr;

    async function handleSignUp() {
        setSubmitted(true);
        setError(null);

        if (passwordError || !emailAddress) return;

        if (isSigningUp) return;
        setIsSigningUp(true);

        try {
            const { error } = await signUp.password({ emailAddress, password });
            if (error) return setError(getClerkError(error));
            await signUp.verifications.sendEmailCode();
            router.push("/(auth)/verification?type=sign-up");
        } finally {
            setIsSigningUp(false);
        }
    }

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        setSubmitted(false);
        setPasswordRequirements(validatePassword(val));
    };

    const handleEmailChange = (val: string) => {
        setEmailAddress(val);
        if (submitted) setSubmitted(false);
    };

    useEffect(() => {
        if (signUp?.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address") && signUp.missingFields.length === 0) {
            router.replace("/(auth)/verification?type=sign-up");
        }
    }, [signUp?.status, signUp?.unverifiedFields, signUp?.missingFields, router]);

    useEffect(() => {
        if (isSignedIn) router.replace("/");
    }, [isSignedIn, router]);

    if (!signUp || isSignedIn || signUp.status === "complete") return <Skeleton />;

    const inputErrStyle = {
        email: emailError ? "border-destructive/70 border" : "",
        password: passwordError && isPasswordDirty && submitted ? "border-destructive/70 border" : "",
    };
    const iconErrStyle = {
        email: emailError ? opaqueDestructive : mutedForeground,
        password: passwordError && isPasswordDirty && submitted ? opaqueDestructive : mutedForeground,
    };

    return (
        <Screen noSafeArea onTab className="justify-center gap-8">
            <View>
                <Text className="h1">Create Your</Text>
                <Text className="h1">Account</Text>
            </View>

            <View className="relative">
                <Input
                    value={emailAddress}
                    autoCapitalize="none"
                    placeholder="name@domain.com"
                    className={cn("pl-14", inputErrStyle.email)}
                    onChangeText={(val) => handleEmailChange(val)}
                />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Mail color={iconErrStyle.email} size={18} />
                </View>
            </View>

            <View className="relative">
                <Input
                    value={password}
                    placeholder="Min. 8 characters"
                    secureTextEntry={!passwordVisible}
                    className={cn("pl-14", inputErrStyle.password)}
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <View className="absolute top-1/2 left-4 -translate-y-1/2">
                    <Lock color={iconErrStyle.password} size={18} />
                </View>

                <Button
                    size={"icon"}
                    variant={"ghost"}
                    onPress={() => setPasswordVisible((visible) => !visible)}
                    className={cn(password ? "block" : "hidden", "absolute top-1/2 right-2 -translate-y-1/2")}
                >
                    {passwordVisible ? <EyeOff color={mutedForeground} size={16} /> : <Eye color={mutedForeground} size={16} />}
                </Button>
            </View>

            <ErrorMessage message={error || errors.fields.emailAddress?.message || errors.fields.password?.message} />

            <PasswordRequirements value={password} isPasswordDirty={isPasswordDirty} passwordRequirements={passwordRequirements} submitted={submitted} />

            <Button onPress={handleSignUp} variant="secondary" disabled={!emailAddress || !password || fetchStatus === "fetching" || isSigningUp} component>
                <View className="row gap-4">
                    {isSigningUp && <ActivityIndicator color={"#ffffff"} />}
                    <Text className="text-xl font-bold">Create Account</Text>
                </View>
            </Button>

            <View className="gap-2">
                <GoogleSignInButton />

                <View className="row gap-2 self-center">
                    <Text className="text-muted-foreground">Already have an account?</Text>
                    <NavLink href="/(auth)/sign-in">Sign In</NavLink>
                </View>
            </View>
        </Screen>
    );
}
