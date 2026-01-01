"use client";

import { useMemo } from "react";
import { formatDateWithOrdinal, generateCalendarWithMonths } from "@/lib/calendar";
import { Entry } from "@/lib/entries";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";

export default function CalendarGrid({ data, size }: { data: Map<string, Entry>; size?: number; }) {
    const { days, monthLabels } = useMemo(() => generateCalendarWithMonths(), []);

    // console.log(data);

    return (
        <div className="w-fit overflow-x-auto">
            {/* month labels */}
            <div
                className="grid gap-1 mb-2"
                style={{
                    gridAutoFlow: "column",
                    gridAutoColumns: `${size ?? 20}px`
                }}
            >
                {monthLabels.map((m, i) => (
                    <div
                        key={i}
                        className="text-xs text-secondary-foreground text-center"
                        style={{
                            gridColumn: `${m.startWeek + 1} / ${m.endWeek + 2}`
                        }}
                    >
                        {m.label}
                    </div>
                ))}
            </div>

            {/* actual calendar grid */}
            <div
                className="grid gap-1"
                style={{
                    gridAutoFlow: "column",
                    gridTemplateRows: `repeat(7, ${size ?? 20}px)`,
                    gridAutoColumns: `${size ?? 20}px`
                }}
            >
                {days.map(d => {
                    const key = d.toISOString().slice(0, 10);
                    const info = data.get(key);

                    // console.log(key, info);

                    return (
                        <Tooltip key={key}>
                            <TooltipTrigger asChild>
                                <div
                                    // title={key}
                                    className={cn(
                                        "rounded-sm",
                                        "hover:ring-1 hover:ring-primary",
                                        !info ? "bg-primary/25" : ""
                                    )}
                                    style={{
                                        backgroundColor: info?.tags[0].color,
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col gap-2 max-w-[200px]">
                                <span className="font-medium">
                                    {formatDateWithOrdinal(d)}
                                </span>

                                {
                                    info && (
                                        <div className="flex flex-col gap-1">
                                            {
                                                info.tags.map((t) => (
                                                    <div key={`${key}-${t.id}-${t.color}`} className="flex gap-1 items-center">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                                                        <span className="truncate">
                                                            {t.label}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </TooltipContent>
                        </Tooltip>

                    );
                })}
            </div>

        </div>
    );
}
