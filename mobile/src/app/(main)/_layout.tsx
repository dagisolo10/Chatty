import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "@/constants/colors";
import { ScreenSkeleton } from "@/components/ui/skeleton";

export default function MainLayout() {
    // const { isSignedIn } = useAuthStore();
    const { isSignedIn, isLoaded } = useAuth();

    const { background, border } = useThemeColors();

    // const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // useEffect(() => {
    //     setTimeout(() => setIsLoaded(true), 100);
    // }, []);

    if (!isLoaded) return <ScreenSkeleton tag="home" />;

    if (!isSignedIn) return <Redirect href="/(auth)/sign-up" />;

    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle: { height: 72, paddingTop: 6, backgroundColor: background, borderTopColor: border } }}>
            <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ size, color }) => <Ionicons name="chatbubble" size={size} color={color} /> }} />
            <Tabs.Screen name="contacts" options={{ title: "Contacts", tabBarIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} /> }} />
            <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ size, color }) => <Ionicons name="settings" size={size} color={color} /> }} />
        </Tabs>
    );
}
