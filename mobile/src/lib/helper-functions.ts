export function verificationTexts(isSignIn: boolean, isSecondFactor: boolean, useBackupCode: boolean, factorStrategy: string) {
    const badgeText = isSecondFactor ? "Two-factor authentication" : "Email verification";
    const titleText = isSecondFactor ? "Verify it's you" : "Verify your account";
    const subTitle = isSignIn
        ? isSecondFactor
            ? useBackupCode
                ? "Enter one of your backup codes to finish signing in."
                : factorStrategy === "phone_code"
                  ? "Enter the code sent to your phone to finish signing in."
                  : factorStrategy === "totp"
                    ? "Enter the code from your authenticator app to finish signing in."
                    : "Enter the email code we sent to finish signing in securely."
            : "Enter the email code we sent to finish signing in securely."
        : "Enter the code from your inbox to activate your new account.";
    const fieldLabel = isSecondFactor ? (useBackupCode ? "Backup code" : factorStrategy === "totp" ? "Authenticator code" : "Verification code") : "Verification code";
    const fieldPlaceholder = isSecondFactor
        ? useBackupCode
            ? "Enter your backup code"
            : factorStrategy === "totp"
              ? "Enter your authenticator code"
              : "Enter your verification code"
        : "Enter your verification code";
    const canResend = !isSecondFactor || factorStrategy === "email_code" || factorStrategy === "phone_code";

    return { badgeText, titleText, subTitle, fieldLabel, fieldPlaceholder, canResend };
}
