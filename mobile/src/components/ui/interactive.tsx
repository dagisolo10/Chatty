import { Text } from "./display";

import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { Link, LinkProps } from "expo-router";
import { cva, VariantProps } from "class-variance-authority";
import { GestureResponderEvent, Pressable, TextInput, TextInputProps, Switch, SwitchProps, PressableProps } from "react-native";

export interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    className?: string;
    textClassName?: string;
}

export const buttonVariants = cva("flex-row items-center justify-center rounded-2xl px-6 disabled:pointer-events-none disabled:opacity-70", {
    variants: {
        variant: {
            primary: "border border-primary/40 bg-primary/90 shadow-sm",
            success: "border border-success/30 bg-success",
            secondary: "border border-accent/40 bg-accent/90",
            destructive: "border border-destructive/30 bg-destructive",
            outline: "border border-border bg-card",
            ghost: "bg-transparent",
            link: "bg-transparent px-0 h-auto",
        },

        size: {
            default: "h-14 px-6",
            lg: "h-16 px-8",
            sm: "h-9 px-3 rounded-xl",
            icon: "size-12 px-0",
        },
    },

    defaultVariants: {
        variant: "primary",
        size: "default",
    },
});

export const textVariants = {
    primary: "text-primary-foreground",
    success: "text-success-foreground",
    secondary: "text-primary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
    ghost: "text-foreground",
    link: "text-accent underline",
};

export const Button = ({ variant = "primary", size = "default", children, className, textClassName, onPress, component = false, ...props }: ButtonProps & { component?: boolean }) => {
    const handlePress = (e: GestureResponderEvent) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
    };

    const renderContent = component ? children : <Text className={cn("font-semibold", variant && textVariants[variant], textClassName)}>{children}</Text>;

    return (
        <Pressable onPress={handlePress} className={cn(buttonVariants({ variant, size }), className)} {...props}>
            {renderContent}
        </Pressable>
    );
};

export const navLinkTextVariants = {
    primary: "text-background",
    success: "text-background",
    secondary: "text-background",
    destructive: "text-foreground",
    outline: "text-foreground",
    ghost: "text-foreground",
    link: "text-accent underline",
};

export const NavLink = ({
    href,
    variant = "link",
    size = "default",
    children,
    className,
    textClassName,
    onPress,
    component = false,
    ...props
}: ButtonProps & { href: LinkProps["href"]; component?: boolean }) => {
    const handlePress = (e: GestureResponderEvent) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
    };
    const renderContent = !component ? <Text className={cn("font-sans-medium", variant && navLinkTextVariants[variant], textClassName)}>{children}</Text> : children;

    return (
        <Link href={href} asChild>
            <Button onPress={handlePress} variant={variant} size={size} className={className} {...props}>
                {renderContent}
            </Button>
        </Link>
    );
};

export const Input = ({ className, ...props }: TextInputProps & { className?: string }) => (
    <TextInput placeholderTextColor="#7f8ba8" className={cn("border-border bg-card text-foreground h-14 w-full rounded-2xl border pr-4 pl-4 text-base", className)} {...props} />
);

export const Toggle = ({ value, onToggle, ...props }: Omit<SwitchProps, "value" | "onValueChange"> & { value?: boolean; onToggle?: (val: boolean) => void }) => (
    <Switch
        value={value}
        onValueChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggle?.(val);
        }}
        trackColor={{ false: "#E2E8F0", true: "#ea7a53" }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#E2E8F0"
        {...props}
    />
);
