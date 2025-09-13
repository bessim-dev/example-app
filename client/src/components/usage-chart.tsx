"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
    { date: "Nov 1", usage: 1200, limit: 3333 },
    { date: "Nov 5", usage: 2100, limit: 3333 },
    { date: "Nov 10", usage: 1800, limit: 3333 },
    { date: "Nov 15", usage: 2800, limit: 3333 },
    { date: "Nov 20", usage: 2200, limit: 3333 },
    { date: "Nov 25", usage: 3100, limit: 3333 },
    { date: "Nov 30", usage: 2400, limit: 3333 },
]

interface UsageChartProps {
    detailed?: boolean
}

export function UsageChart({ detailed = false }: UsageChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} />
                    <YAxis className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="usage"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorUsage)"
                        strokeWidth={2}
                    />
                    {detailed && (
                        <Area
                            type="monotone"
                            dataKey="limit"
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="5 5"
                            fill="none"
                            strokeWidth={1}
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
