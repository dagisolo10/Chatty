import { Card, View, Text } from "../ui/display";

import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";

interface PasswordReqProp {
    value: string;
    submitted: boolean;
    isPasswordDirty: boolean;
    passwordRequirements: { oneSpecialCharErr: boolean; passwordLengthErr: boolean; atLeastOneNumberErr: boolean };
}

export default function PasswordRequirements({ value, passwordRequirements, isPasswordDirty, submitted }: PasswordReqProp) {
    const requirements = [
        { label: "At least 8 characters", valid: value.length >= 8, error: passwordRequirements.passwordLengthErr && isPasswordDirty && submitted },
        { label: "At least one number", valid: /\d/.test(value), error: passwordRequirements.atLeastOneNumberErr && isPasswordDirty && submitted },
        { label: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(value), error: passwordRequirements.oneSpecialCharErr && isPasswordDirty && submitted },
    ];

    return (
        <Card variant={"muted"} className="gap-2">
            {requirements.map((req, index) => (
                <View key={index} className="flex-row items-center gap-x-2">
                    {req.error ? <X color={"#e35454"} size={12} /> : <View className={cn("size-1.5 rounded-full", req.valid ? "bg-success" : "bg-muted-foreground")} />}
                    <Text className={cn("text-sm font-semibold", req.valid ? "text-success" : req.error ? "text-destructive" : "text-muted-foreground")}>{req.label}</Text>
                </View>
            ))}
        </Card>
    );
}
