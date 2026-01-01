function startOfWeek(date: Date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
}

function addMonths(date: Date, months: number) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

export function generateCalendarWithMonths() {
    const today = new Date();

    const start = startOfWeek(addMonths(today, -6));
    const end = addMonths(today, 6);

    const days: Date[] = [];
    const monthLabels: {
        startWeek: number;
        endWeek: number;
        label: string;
    }[] = [];

    let weekIndex = -1;
    let activeMonth: number | null = null;
    let monthStartWeek = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() === 0) weekIndex++;

        days.push(new Date(d));

        const month = d.getMonth();

        if (d.getDate() === 1 && month !== activeMonth) {
            if (activeMonth !== null) {
                monthLabels[monthLabels.length - 1].endWeek = weekIndex - 1;
            }

            activeMonth = month;
            monthStartWeek = weekIndex;

            monthLabels.push({
                startWeek: monthStartWeek,
                endWeek: monthStartWeek,
                label: d.toLocaleString("en-US", { month: "short" })
            });
        }
    }

    if (monthLabels.length) {
        monthLabels[monthLabels.length - 1].endWeek = weekIndex;
    }

    return { days, monthLabels };
}

export function getSixMonthRangeLabel(today = new Date()) {
    const start = new Date(today);
    start.setMonth(start.getMonth() - 6);

    const end = new Date(today);
    end.setMonth(end.getMonth() + 6);

    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric"
    });

    return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export function formatDateWithOrdinal(date: Date) {
    const day = date.getDate();

    const ordinal =
        day % 10 === 1 && day !== 11 ? "st" :
            day % 10 === 2 && day !== 12 ? "nd" :
                day % 10 === 3 && day !== 13 ? "rd" :
                    "th";

    const month = date.toLocaleString("en-US", { month: "long" });

    return `${month} ${day}${ordinal}`;
}


export function getPastDate(pastMonths = 3): string {
    const date = new Date();
    date.setUTCMonth(date.getUTCMonth() - pastMonths);

    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return formatter.format(date);
}
