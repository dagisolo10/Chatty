export const getClerkError = (err: any) => {
    return err?.errors?.[0]?.longMessage || err?.message || err?.longMessage || "An unexpected error occurred. Please try again.";
};
