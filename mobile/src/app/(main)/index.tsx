import { Image } from "react-native";
import useAuthStore from "@/store/auth-store";
import { NavLink } from "@/components/ui/interactive";
import { Screen, Text } from "@/components/ui/display";
import { LoadingScreen } from "@/components/ui/screen-ui";

export default function Home() {
    const { user } = useAuthStore();

    if (!user) return <LoadingScreen />;

    return (
        <Screen onTab noSafeArea className="items-center justify-center">
            {user.profile && <Image source={{ uri: user.profile }} className="size-36 rounded-full" />}
            <Text className="h1">Welcome</Text>
            <Text className="h2">{user.name}</Text>
            <Text className="">{user.username}</Text>
            <Text className="">{user.bio}</Text>

            <NavLink href={"/(onboarding)/onboarding"}>Onboarding</NavLink>
        </Screen>
    );
}
