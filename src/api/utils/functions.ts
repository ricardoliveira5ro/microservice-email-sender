export function lastUsageConverter(lastUsage?: Date): string {
    if (!lastUsage)
        return "Never";

    const lastUsageUTC = Date.UTC(lastUsage.getUTCFullYear(), lastUsage.getUTCMonth(), lastUsage.getUTCDate());

    const now = new Date();
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    const daysDiff = Math.round((lastUsageUTC - nowUTC) / 8.64e7);

    if (daysDiff === 0)
        return "Today";
    else if (daysDiff === -1)
        return "Yesterday";
    else
        return lastUsage.toISOString().split('T')[0];
}