"use client";

import CalendarGrid from "@/components/calendar";
import { getSixMonthRangeLabel } from "@/lib/calendar";
import { Entry } from "@/lib/entries";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { ChartAreaInteractive } from "@/components/tags-chart";
import { UserTag } from "@/lib/tags";
import { HistoryIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Dash({ dayMap, stats, tags }: { dayMap: Map<string, Entry>; stats: { tags: any }; tags: UserTag[] }) {
    const isMobile = useMediaQuery("(max-width: 639px)");
    const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
            <div className="col-span-3 w-full bg-card text-card-foreground shadow shadow-card p-5 rounded-xl flex flex-col items-center gap-5">
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-medium">
                            Your Mood Grid
                        </h2>

                        <p className="font-medium text-sm text-muted-foreground">
                            {getSixMonthRangeLabel()}
                        </p>
                    </div>

                    <Select defaultValue="6-6" disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Grid Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Calendar grid range</SelectLabel>
                                <SelectItem value="6-6">6-6 format</SelectItem>
                                <SelectItem value="9-3">9-3 format</SelectItem>
                                <SelectItem value="1year">Past 1 year</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <CalendarGrid
                    data={dayMap}
                    size={isMobile ? 15 : isTablet ? 18 : 22}
                />
            </div>

            <div className="w-full col-span-2 bg-card text-card-foreground shadow shadow-card p-5 rounded-xl">
                <ChartAreaInteractive
                    apiData={stats.tags}
                    userTags={tags}
                />
            </div>

            <div className="col-span-1 w-full h-full bg-card text-card-foreground p-4 rounded-xl flex flex-col items-center justify-center gap-4">
                <span>
                    <HistoryIcon className="size-20 text-muted-foreground" />
                </span>
                <h2 className="text-xl font-medium">More stats coming soon.</h2>
            </div>
        </div>
    )
}