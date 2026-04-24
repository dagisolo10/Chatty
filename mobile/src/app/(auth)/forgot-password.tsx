import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/expo";
import { ActivityIndicator } from "react-native";
import { ErrorMessage } from "@/components/ui/screen-ui";
import { getClerkError } from "@/utils/helper-functions";
import { Text, Screen, View } from "@/components/ui/display";
import { Mail, Lock, Hash, Eye, EyeOff } from "lucide-react-native";
import { Button, Input, NavLink } from "@/components/ui/interactive";
import PasswordRequirements from "@/components/auth/password-requirement";

export default function ForgotPassword() {
    const { signIn, fetchStatus } = useSignIn();

    const router = useRouter();

    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);

    const [codeSent, setCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [passwordRequirements, setPasswordRequirements] = useState({ oneSpecialCharErr: true, passwordLengthErr: true, atLeastOneNumberErr: true });
    const passwordError = passwordRequirements.atLeastOneNumberErr || passwordRequirements.oneSpecialCharErr || passwordRequirements.passwordLengthErr;

    const onRequestReset = async () => {
        if (!email) return;

        setIsLoading(true);
        setError(null);

        try {
            const { error: createError } = await signIn.create({ identifier: email });
            if (createError) {
                setError(getClerkError(createError));
                setIsLoading(false);
                return;
            }

            const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();
            if (sendCodeError) {
                setError(getClerkError(sendCodeError));
            } else {
                setCodeSent(true);
            }
        } catch (err: any) {
            setError(getClerkError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPassword = async () => {
        setSubmitted(true);

        if (passwordError || !code) return;

        setError(null);
        setIsLoading(true);

        try {
            const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({ code });

            if (verifyError) {
                setError(getClerkError(verifyError));
                setIsLoading(false);
                return;
            }

            const { error: submitError } = await signIn.resetPasswordEmailCode.submitPassword({ password });

            if (submitError) {
                setError(getClerkError(submitError));
            } else if (signIn.status === "complete") {
                setResetComplete(true);
            }
        } catch (err: any) {
            setError(getClerkError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        setSubmitted(false);
        setPasswordRequirements({
            passwordLengthErr: val.length < 8,
            atLeastOneNumberErr: !/\d/.test(val),
            oneSpecialCharErr: !/[!@#$%^&*(),.?":{}|<>]/.test(val),
        });
    };

    if (resetComplete) {
        return (
            <Screen noSafeArea onTab className="items-center justify-center gap-10 px-6">
                <View className="items-center gap-4">
                    <View className="bg-success/20 border-success/30 size-20 items-center justify-center rounded-full border">
                        <Text className="text-success text-4xl">✓</Text>
                    </View>

                    <View className="items-center gap-2">
                        <Text className="h1 text-center">Reset Complete</Text>

                        <Text className="text-muted-foreground px-4 text-center">Your password has been successfully updated. You can now log in to your account.</Text>
                    </View>
                </View>

                <View className="w-full gap-4">
                    <Button onPress={() => router.replace("/(auth)/sign-in")} variant="secondary" textClassName="text-xl font-bold">
                        Back to Login
                    </Button>

                    <Text className="text-muted-foreground w-full text-center text-sm">Security tip: Don&apos;t share your code with anyone.</Text>
                </View>
            </Screen>
        );
    }

    return (
        <Screen noSafeArea onTab className="justify-center gap-8">
            <View>
                <Text className="h1">{codeSent ? "Reset Your" : "Forgot"}</Text>
                <Text className="h1">{codeSent ? "Password." : "Password?"}</Text>
                <Text className="text-muted-foreground mt-2">{codeSent ? "Check your email for the 6-digit verification code." : "Enter your email and we'll send you a reset code."}</Text>
            </View>

            {codeSent ? (
                <View className="gap-6">
                    <View className="relative">
                        <Input className="pl-14" value={code} onChangeText={setCode} placeholder="6-digit code" keyboardType="number-pad" />

                        <View className="absolute top-1/2 left-4 -translate-y-1/2">
                            <Hash color="#73738c" size={18} />
                        </View>
                    </View>
                    <View className="relative">
                        <Input className={cn("pl-14", passwordError && submitted ? "border-destructive/70 border" : "")} value={password} onChangeText={handlePasswordChange} placeholder="New password" secureTextEntry={!passwordVisible} />

                        <View className="absolute top-1/2 left-4 -translate-y-1/2">
                            <Lock color={passwordError && submitted ? "#e35454bf" : "#73738c"} size={18} />
                        </View>

                        <Button className="absolute top-1/2 right-2 -translate-y-1/2" variant="ghost" size="icon" onPress={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ? <EyeOff color="#73738c" size={16} /> : <Eye color="#73738c" size={16} />}
                        </Button>
                    </View>

                    <PasswordRequirements value={password} isPasswordDirty={password.length > 0} passwordRequirements={passwordRequirements} submitted={submitted} />

                    <Button onPress={onResetPassword} variant="secondary" disabled={isLoading || fetchStatus === "fetching" || !code || !password} component>
                        <View className="row gap-4">
                            {(isLoading || fetchStatus === "fetching") && <ActivityIndicator color="#fff" />}

                            <Text className="text-xl font-bold">Reset Password</Text>
                        </View>
                    </Button>
                </View>
            ) : (
                <View className="gap-6">
                    <View className="relative">
                        <Input className="pl-14" value={email} onChangeText={setEmail} placeholder="name@domain.com" autoCapitalize="none" keyboardType="email-address" />

                        <View className="absolute top-1/2 left-4 -translate-y-1/2">
                            <Mail color="#73738c" size={18} />
                        </View>
                    </View>

                    <Button onPress={onRequestReset} variant="secondary" disabled={!email || isLoading || fetchStatus === "fetching"}>
                        <View className="row gap-4">
                            {(isLoading || fetchStatus === "fetching") && <ActivityIndicator color="#fff" />}

                            <Text className="text-xl font-bold">Send Code</Text>
                        </View>
                    </Button>
                </View>
            )}

            <ErrorMessage message={error} />

            <View className="row gap-2 self-center">
                <Text className="text-muted-foreground">Remembered it?</Text>

                <NavLink href="/(auth)/sign-in">Sign In</NavLink>
            </View>
        </Screen>
    );
}
