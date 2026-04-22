import { Card, Screen, View } from "./display";

import { Animated } from "react-native";
import { useEffect, useRef } from "react";

export type ScreenSkeletonTag = "app-shell" | "sign-in" | "sign-up" | "verification" | "home" | "chat" | "onboarding";

function SkeletonBlock({ className }: { className?: string }) {
    const opacity = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([Animated.timing(opacity, { toValue: 0.9, duration: 900, useNativeDriver: true }), Animated.timing(opacity, { toValue: 0.45, duration: 900, useNativeDriver: true })]),
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return <Animated.View style={{ opacity }} className={className ?? "bg-card h-4 rounded-xl"} />;
}

function SkeletonDecor() {
    return (
        <>
            <View className="bg-primary/20 absolute -top-16 -right-5 size-44 rounded-full" />
            <View className="bg-accent/10 absolute top-72 -left-8 size-36 rounded-full" />
        </>
    );
}

export function ScreenSkeleton({ tag = "app-shell" }: { tag?: ScreenSkeletonTag }) {
    switch (tag) {
        case "home":
            return <HomeShell />;

        case "chat":
            return <ChatShell />;

        case "app-shell":
            return <AppShell />;

        case "sign-in":
            return <AuthShell />;

        case "sign-up":
            return <AuthShell />;

        case "verification":
            return <VerificationShell />;

        default:
            return <DefaultShell />;
    }
}

function AppShell() {
    return (
        <Screen noSafeArea className="justify-center gap-6">
            <SkeletonDecor />
            <View className="gap-4">
                <SkeletonBlock className="bg-primary/30 h-8 w-28 rounded-full" />
                <SkeletonBlock className="bg-card h-12 w-56 rounded-2xl" />
                <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                <SkeletonBlock className="bg-card h-5 w-10/12 rounded-xl" />
            </View>
            <Card className="gap-4">
                <SkeletonBlock className="bg-card h-6 w-40 rounded-xl" />
                <SkeletonBlock className="bg-card h-24 w-full rounded-[28px]" />
                <SkeletonBlock className="bg-primary/60 h-14 w-full rounded-2xl" />
            </Card>
        </Screen>
    );
}

function AuthShell() {
    return (
        <Screen className="justify-center gap-8">
            <SkeletonDecor />
            <View className="gap-4">
                <SkeletonBlock className="bg-primary/30 h-8 w-32 rounded-full" />
                <SkeletonBlock className="bg-card h-12 w-64 rounded-2xl" />
                <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                <SkeletonBlock className="bg-card h-5 w-9/12 rounded-xl" />
            </View>

            <Card className="gap-4">
                <View className="row items-start gap-4">
                    <SkeletonBlock className="bg-primary/15 h-12 w-12 rounded-2xl" />
                    <View className="flex-1 gap-2">
                        <SkeletonBlock className="bg-card h-6 w-40 rounded-xl" />
                        <SkeletonBlock className="bg-card h-4 w-full rounded-xl" />
                    </View>
                </View>

                <SkeletonBlock className="bg-card h-12 w-full rounded-2xl" />
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-24 rounded-xl" />
                    <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
                </View>
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-24 rounded-xl" />
                    <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
                </View>
                <SkeletonBlock className="bg-primary/60 h-14 w-full rounded-2xl" />
            </Card>

            <Card variant="muted" className="gap-3">
                <SkeletonBlock className="bg-card h-4 w-full rounded-xl" />
                <SkeletonBlock className="bg-card h-4 w-8/12 rounded-xl" />
            </Card>
        </Screen>
    );
}

function VerificationShell() {
    return (
        <Screen noSafeArea className="justify-center">
            <SkeletonDecor />
            <Card className="gap-5">
                <SkeletonBlock className="bg-accent/30 h-8 w-44 rounded-full" />
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-10 w-48 rounded-2xl" />
                    <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                    <SkeletonBlock className="bg-card h-5 w-10/12 rounded-xl" />
                </View>
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-32 rounded-xl" />
                    <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
                </View>
                <SkeletonBlock className="bg-primary/60 h-14 w-full rounded-2xl" />
                <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
            </Card>
        </Screen>
    );
}

function HomeShell() {
    return (
        <Screen noSafeArea className="gap-6">
            <SkeletonDecor />
            <View className="gap-6">
                <View className="gap-3">
                    <SkeletonBlock className="bg-primary/30 h-8 w-36 rounded-full" />
                    <SkeletonBlock className="bg-card h-4 w-36 rounded-xl" />
                    <SkeletonBlock className="bg-card h-14 w-64 rounded-[20px]" />
                    <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                    <SkeletonBlock className="bg-card h-5 w-10/12 rounded-xl" />
                </View>

                <Card className="gap-5">
                    <View className="row justify-between">
                        <View className="gap-2">
                            <SkeletonBlock className="bg-card h-3 w-24 rounded-xl" />
                            <SkeletonBlock className="bg-card h-8 w-40 rounded-xl" />
                        </View>
                        <SkeletonBlock className="bg-primary/20 h-12 w-12 rounded-2xl" />
                    </View>
                    <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                    <SkeletonBlock className="bg-card h-5 w-11/12 rounded-xl" />
                    <SkeletonBlock className="bg-primary/60 h-14 w-full rounded-2xl" />
                    <SkeletonBlock className="bg-primary/40 h-14 w-full rounded-2xl" />
                </Card>
            </View>

            <View className="gap-4">
                <View className="row gap-4">
                    <Card variant="muted" className="flex-1 gap-3">
                        <SkeletonBlock className="bg-accent/20 h-11 w-11 rounded-2xl" />
                        <SkeletonBlock className="bg-card h-6 w-24 rounded-xl" />
                        <SkeletonBlock className="bg-card h-4 w-full rounded-xl" />
                        <SkeletonBlock className="bg-card h-4 w-9/12 rounded-xl" />
                    </Card>
                    <Card variant="muted" className="flex-1 gap-3">
                        <SkeletonBlock className="bg-primary/20 h-11 w-11 rounded-2xl" />
                        <SkeletonBlock className="bg-card h-6 w-28 rounded-xl" />
                        <SkeletonBlock className="bg-card h-4 w-full rounded-xl" />
                        <SkeletonBlock className="bg-card h-4 w-10/12 rounded-xl" />
                    </Card>
                </View>
                <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
            </View>
        </Screen>
    );
}

function ChatShell() {
    return (
        <Screen noSafeArea className="gap-6">
            <SkeletonDecor />
            <View className="gap-3">
                <SkeletonBlock className="bg-accent/30 h-8 w-36 rounded-full" />
                <SkeletonBlock className="bg-card h-10 w-52 rounded-2xl" />
                <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                <SkeletonBlock className="bg-card h-5 w-10/12 rounded-xl" />
            </View>

            <Card className="row justify-between">
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-28 rounded-xl" />
                    <SkeletonBlock className="bg-card h-7 w-32 rounded-xl" />
                </View>
                <SkeletonBlock className="bg-card h-9 w-28 rounded-xl" />
            </Card>

            <Card variant="muted" className="flex-1 gap-4">
                <View className="row justify-between">
                    <View className="row gap-3">
                        <SkeletonBlock className="bg-primary/20 h-11 w-11 rounded-2xl" />
                        <View className="gap-2">
                            <SkeletonBlock className="bg-card h-6 w-36 rounded-xl" />
                            <SkeletonBlock className="bg-card h-4 w-52 rounded-xl" />
                        </View>
                    </View>
                    <SkeletonBlock className="bg-card h-4 w-16 rounded-xl" />
                </View>

                <View className="gap-3">
                    <SkeletonBlock className="bg-background/60 h-20 w-full rounded-2xl" />
                    <SkeletonBlock className="bg-background/60 h-20 w-full rounded-2xl" />
                    <SkeletonBlock className="bg-background/60 h-20 w-10/12 rounded-2xl" />
                </View>

                <View className="mt-auto gap-2">
                    <SkeletonBlock className="bg-card h-3 w-36 rounded-xl" />
                    <View className="row gap-3">
                        <SkeletonBlock className="bg-card h-14 flex-1 rounded-2xl" />
                        <SkeletonBlock className="bg-primary/60 h-12 w-12 rounded-2xl" />
                    </View>
                </View>
            </Card>
        </Screen>
    );
}

function DefaultShell() {
    return (
        <Screen className="justify-center gap-8">
            <SkeletonDecor />
            <View className="gap-4">
                <SkeletonBlock className="bg-primary/30 h-8 w-32 rounded-full" />
                <SkeletonBlock className="bg-card h-12 w-60 rounded-2xl" />
                <SkeletonBlock className="bg-card h-5 w-full rounded-xl" />
                <SkeletonBlock className="bg-card h-5 w-9/12 rounded-xl" />
            </View>

            <Card className="gap-4">
                <View className="row items-center gap-4">
                    <SkeletonBlock className="bg-primary/20 h-16 w-16 rounded-3xl" />
                    <View className="flex-1 gap-2">
                        <SkeletonBlock className="bg-card h-7 w-40 rounded-xl" />
                        <SkeletonBlock className="bg-card h-4 w-48 rounded-xl" />
                    </View>
                    <SkeletonBlock className="bg-primary/20 h-16 w-16 rounded-full" />
                </View>

                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-28 rounded-xl" />
                    <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
                </View>
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-24 rounded-xl" />
                    <SkeletonBlock className="bg-card h-14 w-full rounded-2xl" />
                </View>
                <View className="gap-2">
                    <SkeletonBlock className="bg-card h-3 w-16 rounded-xl" />
                    <SkeletonBlock className="bg-card h-32 w-full rounded-2xl" />
                </View>
                <SkeletonBlock className="bg-primary/60 h-14 w-full rounded-2xl" />
            </Card>

            <Card variant="muted" className="gap-3">
                <SkeletonBlock className="bg-card h-4 w-full rounded-xl" />
                <SkeletonBlock className="bg-card h-4 w-9/12 rounded-xl" />
            </Card>
        </Screen>
    );
}
