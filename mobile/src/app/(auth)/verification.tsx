import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useSignIn, useSignUp } from "@clerk/expo";
import { verificationTexts } from "@/constants/texts";
import { ErrorMessage } from "@/components/ui/screen-ui";
import { getClerkError } from "@/utils/helper-functions";
import { Input, Button } from "@/components/ui/interactive";
import { Text, Screen, View } from "@/components/ui/display";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Hash, ShieldCheck, RefreshCw, RotateCcw } from "lucide-react-native";

export default function Verification() {
    const router = useRouter();

    const { type, mode, strategy } = useLocalSearchParams<{ type?: string; mode?: string; strategy?: string }>();

    const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
    const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

    const [code, setCode] = useState("");

    const isSignIn = type === "sign-in";
    const isSecondFactor = mode === "second-factor";
    const factorStrategy = typeof strategy === "string" ? strategy : "email_code";
    const supportsBackupCode = signIn.supportedSecondFactors?.some((factor) => factor.strategy === "backup_code");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useBackupCode, setUseBackupCode] = useState(false);

    const isFetching = signInFetchStatus === "fetching" || signUpFetchStatus === "fetching" || isLoading;

    async function signInVerify() {
        setIsLoading(true);
        setError(null);
        let result;

        if (isSecondFactor) {
            if (useBackupCode) result = await signIn.mfa.verifyBackupCode({ code });
            else if (factorStrategy === "phone_code") result = await signIn.mfa.verifyPhoneCode({ code });
            else if (factorStrategy === "totp") result = await signIn.mfa.verifyTOTP({ code });
            else result = await signIn.mfa.verifyEmailCode({ code });
        } else {
            result = await signIn.emailCode.verifyCode({ code });
        }

        if (result?.error) {
            setError(getClerkError(result.error));
        } else if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session }) => {
                    if (session?.currentTask) {
                        setError(`Additional task required: ${session.currentTask}`);
                        return;
                    }
                    router.replace("/");
                },
            });
        }
        setIsLoading(false);
    }

    async function signUpVerify() {
        setIsLoading(true);
        setError(null);
        const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });

        if (verifyError) {
            setError(getClerkError(verifyError));
        } else if (signUp.status === "complete") {
            await signUp.finalize({ navigate: () => router.replace("/(onboarding)/onboarding") });
        }
        setIsLoading(false);
    }

    const handleVerify = async () => (isSignIn ? signInVerify() : signUpVerify());

    function handleNewCode() {
        setError(null);
        try {
            if (isSignIn) {
                if (isSecondFactor) {
                    if (factorStrategy === "phone_code") signIn.mfa.sendPhoneCode();
                    else signIn.mfa.sendEmailCode();
                } else {
                    signIn.emailCode.sendCode();
                }
            } else {
                signUp.verifications.sendEmailCode();
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not resend code.");
        }
    }

    const vt = verificationTexts(isSignIn, isSecondFactor, useBackupCode, factorStrategy);

    return (
        <Screen noSafeArea className="justify-center gap-6">
            <View className="gap-2">
                <View className="bg-primary/10 border-primary/20 mb-2 self-start rounded-full border px-3 py-1">
                    <Text className="text-primary text-xs font-bold tracking-widest uppercase">{vt.badgeText}</Text>
                </View>
                <Text className="h1">{vt.titleText}</Text>
                <Text className="text-muted-foreground text-base leading-6">{vt.subTitle}</Text>
            </View>

            <View className="gap-6">
                <View className="relative">
                    <Input className="pl-14" value={code} onChangeText={setCode} placeholder="123456" keyboardType="number-pad" maxLength={isSecondFactor && useBackupCode ? 12 : 6} />
                    <View className="absolute top-1/2 left-5 -translate-y-1/2">{isSecondFactor ? <ShieldCheck color="#73738c" size={20} /> : <Hash color="#73738c" size={20} />}</View>
                </View>

                <Button onPress={handleVerify} variant="secondary" disabled={isFetching || !code} component>
                    <View className="row gap-3">
                        {isFetching && <ActivityIndicator color="#fff" />}
                        <Text className="text-xl font-bold">Verify Identity</Text>
                    </View>
                </Button>
            </View>

            <ErrorMessage message={error} />

            <View className="gap-3">
                {vt.canResend && (
                    <Button onPress={handleNewCode} variant="outline" className="border-dashed">
                        <View className="row gap-2">
                            <RefreshCw size={14} color="#73738c" />
                            <Text className="text-muted-foreground font-medium">I need a new code</Text>
                        </View>
                    </Button>
                )}

                {isSignIn && isSecondFactor && supportsBackupCode && (
                    <Button
                        onPress={() => {
                            setUseBackupCode((current) => !current);
                            setCode("");
                            setError(null);
                        }}
                        variant="ghost"
                    >
                        <Text className="text-primary font-medium">{useBackupCode ? "Use primary factor" : "Use a backup code"}</Text>
                    </Button>
                )}

                {isSignIn && (
                    <Button onPress={() => signIn.reset()} variant="ghost" className="mt-4">
                        <View className="row gap-2">
                            <RotateCcw size={14} color="#73738c" />
                            <Text className="text-muted-foreground">Start over</Text>
                        </View>
                    </Button>
                )}
            </View>
        </Screen>
    );
}
