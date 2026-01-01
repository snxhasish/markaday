export function getTodayInTimezone(timeZone = "Asia/Tokyo") {
    const formatter = new Intl.DateTimeFormat("en-CA", { // en-CA ensures YYYY-MM-DD format
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return formatter.format(new Date()); // YYYY-MM-DD
}
