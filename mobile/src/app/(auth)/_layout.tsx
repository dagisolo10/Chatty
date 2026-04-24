import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import useThemeColors from "@/constants/colors";
import { ScreenSkeleton } from "@/components/ui/skeleton";

export default function AuthRoutesLayout() {
    const { background } = useThemeColors();
    const { isSignedIn, isLoaded } = useAuth();
    // const { isSignedIn } = useAuthStore();

    // const [isLoaded, setIsLoaded] = useState(false);

    // useEffect(() => {
    //     setTimeout(() => setIsLoaded(true), 100);
    // }, []);

    if (!isLoaded) return <ScreenSkeleton tag="sign-in" />;

    if (isSignedIn) return <Redirect href={"/"} />;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: background },
            }}
        />
    );
}
