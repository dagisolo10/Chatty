export const getClerkError = (err: any): string => err?.errors?.[0]?.longMessage || err?.message || err?.longMessage || "An unexpected error occurred. Please try again.";

export const formatTime = (date: string | Date) => new Date(date).toLocaleTimeString();

export function sanitizeUsername(value: string) {
    return value
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9._]/g, "")
        .slice(0, 24);
}
