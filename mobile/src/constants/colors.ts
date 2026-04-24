import useTheme from "@/store/theme-store";

export default function useThemeColors() {
    const { isDark } = useTheme();

    return {
        destructive: "#e35454",
        opaqueDestructive: "#e35454bf",
        border: "#2e2e3d",

        accent: isDark ? "#ff6569" : "#ea7a53",
        success: isDark ? "#00bc7d" : "#16a34a",
        primary: isDark ? "#5b7cff" : "#4f7cff",

        background: isDark ? "#191921" : "#f8fafc",
        foreground: isDark ? "#ffffff" : "#081126",

        card: isDark ? "#2d2d43" : "hsl(48, 68%, 89%)",
        cardForeground: isDark ? "#ffffff" : "#081126",

        muted: isDark ? "#23232f" : "#e2e8f0",
        mutedForeground: isDark ? "#73738c" : "#334155",
    };
}
