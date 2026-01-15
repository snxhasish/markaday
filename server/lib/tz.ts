const dayArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function isValidTimeZone(tz: string) {
    try {
        Intl.DateTimeFormat("en-US", { timeZone: tz });
        return true;
    } catch {
        return false;
    }
}

export function isValidDay(day: string) {
    return dayArray.includes(day.toLowerCase());
}