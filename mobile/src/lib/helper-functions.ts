export const getClerkError = (err: any): string => err?.errors?.[0]?.longMessage || err?.message || err?.longMessage || "An unexpected error occurred. Please try again.";

export const formatTime = (date: string | Date) => new Date(date).toLocaleTimeString();
