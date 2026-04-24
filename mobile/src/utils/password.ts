export const validatePassword = (password: string) => {
    return {
        passwordLengthErr: password.length < 8,
        atLeastOneNumberErr: !/\d/.test(password),
        oneSpecialCharErr: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
};

export type PasswordRequirementsType = ReturnType<typeof validatePassword>;
