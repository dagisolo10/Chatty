import { Button } from "./interactive";
import { Text, Screen } from "./display";

import { Link, LinkProps } from "expo-router";
import { ActivityIndicator } from "react-native";

export function ErrorScreen({ message = "Something went wrong", href = "/", button = "Go Home" }: { message?: string; href?: LinkProps["href"]; button?: string }) {
    return (
        <Screen className="items-center justify-center gap-4 px-6">
            <Text className="text-center text-3xl">{message}</Text>
            {href && (
                <Link href={href} asChild>
                    <Button className="h-14 rounded-2xl">{button}</Button>
                </Link>
            )}
        </Screen>
    );
}

export function LoadingScreen() {
    return (
        <Screen className="items-center justify-center gap-4">
            <Text className="text-3xl">Loading...</Text>
            <ActivityIndicator size="large" />
        </Screen>
    );
}

export function ErrorMessage({ message }: { message?: string | null }) {
    if (!message) return null;
    return <Text className="text-destructive mt-2 text-sm">{message}</Text>;
}
