"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserTag } from "@/lib/tags"

type ApiRow = {
    date: string
    tags: Record<string, number> // tagId -> count
}

/* ---------------- helpers ---------------- */

function normalizeChartData(rows: ApiRow[]) {
    const tagIds = new Set<string>()

    rows.forEach(r => {
        Object.keys(r.tags).forEach(id => tagIds.add(id))
    })

    return {
        tagIds: Array.from(tagIds),
        data: rows.map(r => {
            const row: Record<string, any> = { date: r.date }
            tagIds.forEach(id => {
                row[id] = r.tags[id] ?? 0
            })
            return row
        })
    }
}

/* ---------------- component ---------------- */

export function ChartAreaInteractive({
    apiData,
    userTags,
}: {
    apiData: ApiRow[]
    userTags: UserTag[]
}) {
    const [timeRange, setTimeRange] = React.useState("180d")

    /* tagId -> tag meta */
    const tagMap = React.useMemo(() => {
        return Object.fromEntries(userTags.map(t => [t.id, t]))
    }, [userTags])

    const { data, tagIds } = React.useMemo(
        () => normalizeChartData(apiData),
        [apiData]
    )

    const chartConfig = React.useMemo(() => {
        return Object.fromEntries(
            tagIds.map(tagId => [
                tagId,
                {
                    label: tagMap[tagId]?.label ?? "Unknown",
                    color: tagMap[tagId]?.color ?? "#888",
                },
            ])
        )
    }, [tagIds, tagMap]) satisfies ChartConfig

    const filteredData = React.useMemo(() => {
        if (!data.length) return []

        const referenceDate = new Date(data.at(-1)!.date)
        const days =
            timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 180

        const start = new Date(referenceDate)
        start.setDate(start.getDate() - days)

        return data.filter(d => new Date(d.date) >= start)
    }, [data, timeRange])

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
                <div className="flex-1">
                    <CardTitle>Tag Usage</CardTitle>
                    <CardDescription>
                        How your tags trend over time
                    </CardDescription>
                </div>

                <Select value={timeRange} onValueChange={setTimeRange} disabled>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="180d">Last 6 months</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6">
                <ChartContainer
                    config={chartConfig}
                    className="h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <CartesianGrid vertical={true} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(v) =>
                                new Date(v).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(v) =>
                                        new Date(v).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />

                        {tagIds.map(tagId => (
                            <Area
                                key={tagId}
                                dataKey={tagId}
                                type="natural"
                                stackId="a"
                                stroke={chartConfig[tagId].color}
                                fill={chartConfig[tagId].color}
                                fillOpacity={0.2}
                            />
                        ))}

                        {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
