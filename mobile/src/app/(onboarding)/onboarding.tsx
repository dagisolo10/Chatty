import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import useAuthStore from "@/store/auth-store";
import { UserResponse } from "@/types/response";
import useThemeColors from "@/hooks/use-colors";
import * as ImagePicker from "expo-image-picker";
import { CreateUserPayload } from "@/types/payloads";
import { ActivityIndicator, Image } from "react-native";
import { ErrorMessage } from "@/components/ui/screen-ui";
import { sanitizeUsername } from "@/lib/helper-functions";
import { Button, Input } from "@/components/ui/interactive";
import { AtSign, Edit, UserRound } from "lucide-react-native";
import { Field, Screen, Text, View } from "@/components/ui/display";

export default function Onboarding() {
    const [bio, setBio] = useState("");
    const [name, setName] = useState("");
    const [profile, setProfile] = useState("");
    const [username, setUsername] = useState(sanitizeUsername(""));

    const router = useRouter();
    const { getToken } = useAuth();
    const { setUser } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState({ nameErr: false, usernameErr: false });

    const { opaqueDestructive, mutedForeground } = useThemeColors();

    async function pickImage() {
        try {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) {
                setError("Photo library access was denied. Please enable it in settings.");
                return;
            }

            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: "images", allowsEditing: true, aspect: [1, 1], quality: 0.5 });
            if (!res.canceled) {
                setProfile(res.assets[0].uri);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch (error) {
            console.error("Failed to pick image:", error);
        }
    }

    async function finishOnboarding() {
        setSubmitted(true);

        const nameErr = name.trim().length < 3;
        const usernameErr = username.trim().length < 3;

        if (nameErr || usernameErr) {
            setFormError({ nameErr, usernameErr });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        if (submitting) return;

        setError(null);
        setSubmitting(true);

        try {
            const token = await getToken();
            if (!token) return setError("Your session has expired. Please sign in again.");

            const payload: CreateUserPayload = { name: name.trim(), username, profile: profile || undefined, bio: bio.trim() || undefined };
            const auth = { headers: { Authorization: `Bearer ${token}` } };

            const res = await api.post<UserResponse>("/auth/sync", payload, auth);
            const { data, success, error: apiError } = res.data;

            if (!success) {
                console.error("Backend error:", apiError);
                setError(apiError || "Failed to sync user.");
                return;
            }

            setUser(data);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/");
        } catch (err: any) {
            const apiError = err?.response?.data?.error;
            const message = apiError || err?.message || "Something went wrong. Please try again.";
            console.error("Onboarding sync failed:", message, err);
            setError(message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setSubmitting(false);
        }
    }

    function handleNameChange(val: string) {
        setName(val);
        setSubmitted(false);
        setFormError((prev) => ({ ...prev, nameErr: val.trim().length < 3 }));
    }

    function handleUserNameChange(val: string) {
        const sanitized = sanitizeUsername(val);
        setSubmitted(false);
        setUsername(sanitized);
        setFormError((prev) => ({ ...prev, usernameErr: sanitized.length < 3 }));
    }

    const inputErrStyle = {
        name: formError.nameErr && submitted ? "border-destructive/70 border" : "",
        username: formError.usernameErr && submitted ? "border-destructive/70 border" : "",
    };
    const iconErrStyle = {
        name: formError.nameErr && submitted ? opaqueDestructive : mutedForeground,
        username: formError.usernameErr && submitted ? opaqueDestructive : mutedForeground,
    };

    return (
        <Screen noSafeArea className="gap-8 pt-36">
            <View className="items-center">
                <Text className="h3">Fill Your Profile</Text>
                <Text className="text-muted-foreground">You can always change your details in the settings</Text>
            </View>

            <View className="relative items-center self-center">
                <View className="size-32 items-center justify-center overflow-hidden rounded-full">
                    <Image source={profile ? { uri: profile } : require("../../../assets/images/no-user.jpg")} className={cn("size-44", !profile && "opacity-25")} />
                </View>

                <Button onPress={pickImage} className="absolute -right-2 bottom-0" size={"icon"} variant={"ghost"} component>
                    <Edit size={24} color={mutedForeground} />
                </Button>
            </View>

            <Field label="Display name">
                <View className="relative">
                    <Input value={name} placeholder="What should people call you?" onChangeText={(val) => handleNameChange(val)} className={cn("pl-12", inputErrStyle.name)} />
                    <View className="absolute top-0 left-4 h-14 justify-center">
                        <UserRound color={iconErrStyle.name} size={18} />
                    </View>
                </View>
            </Field>

            <Field label="Username">
                <View className="relative">
                    <Input
                        value={username}
                        className={cn("pl-12", inputErrStyle.username)}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="your_handle"
                        onChangeText={(val) => handleUserNameChange(val)}
                    />
                    <View className="absolute top-0 left-4 h-14 justify-center">
                        <AtSign color={iconErrStyle.username} size={18} />
                    </View>
                </View>
            </Field>

            <Field label="Bio">
                <View className="min-h-32">
                    <Input
                        multiline
                        value={bio}
                        maxLength={160}
                        onChangeText={setBio}
                        textAlignVertical="top"
                        className="flex-1 pt-4"
                        placeholder="Tell people a little about you..."
                    />
                </View>
            </Field>

            <ErrorMessage message={error} />

            <Button onPress={finishOnboarding} disabled={submitting} component>
                <View className="row gap-4">
                    {submitting && <ActivityIndicator color={"#ffffff"} />}
                    <Text className="font-bold">Continue to Chatty</Text>
                </View>
            </Button>
        </Screen>
    );
}
