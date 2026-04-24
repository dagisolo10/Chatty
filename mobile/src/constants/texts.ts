export function verificationTexts(isSignIn: boolean, isSecondFactor: boolean, useBackupCode: boolean, factorStrategy: string) {
    const badgeText = isSecondFactor ? "Security Check" : "Email Verification";
    const titleText = isSecondFactor ? "Enter Code" : "Check Your Email";

    const subTitle = isSignIn
        ? isSecondFactor
            ? useBackupCode
                ? "Enter one of your emergency backup codes."
                : factorStrategy === "phone_code"
                  ? "We sent a secure code via SMS to your phone."
                  : factorStrategy === "totp"
                    ? "Enter the 6-digit code from your authenticator app."
                    : "Check your inbox for the secondary security code."
            : "We sent a verification code to your email address."
        : "Activate your account by entering the code sent to your inbox.";

    const canResend = !isSecondFactor || factorStrategy === "email_code" || factorStrategy === "phone_code";

    return { badgeText, titleText, subTitle, canResend };
}
