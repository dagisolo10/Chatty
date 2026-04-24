import { Card, View, Text } from "../ui/display";

import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";
import { PasswordRequirementsType, validatePassword } from "@/utils/password";

interface PasswordReqProp {
    value: string;
    submitted: boolean;
    isPasswordDirty: boolean;
    passwordRequirements: PasswordRequirementsType;
}

export default function PasswordRequirements({ value, passwordRequirements, isPasswordDirty, submitted }: PasswordReqProp) {
    const results = validatePassword(value);

    const requirements = [
        { label: "At least 8 characters", valid: !results.passwordLengthErr, error: passwordRequirements.passwordLengthErr && isPasswordDirty && submitted },
        { label: "At least one number", valid: !results.atLeastOneNumberErr, error: passwordRequirements.atLeastOneNumberErr && isPasswordDirty && submitted },
        { label: "One special character", valid: !results.oneSpecialCharErr, error: passwordRequirements.oneSpecialCharErr && isPasswordDirty && submitted },
    ];

    return (
        <Card variant={"muted"} className="gap-2">
            {requirements.map((req, index) => {
                const textColor = req.error ? "text-destructive" : req.valid ? "text-success" : "text-muted-foreground";

                const dotColor = req.valid ? "bg-success" : "bg-muted-foreground";

                return (
                    <View key={index} className="flex-row items-center gap-x-2">
                        {req.error ? <X color={"#e35454"} size={12} /> : <View className={cn("size-1.5 rounded-full", dotColor)} />}
                        <Text className={cn("text-sm font-semibold", textColor)}>{req.label}</Text>
                    </View>
                );
            })}
        </Card>
    );
}
