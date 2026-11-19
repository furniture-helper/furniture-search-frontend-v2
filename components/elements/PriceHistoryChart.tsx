import {PriceHistoryEntry} from "@/types/ProductTypes";
import {Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export type Props = {
    priceHistory: PriceHistoryEntry[]
}

type ChartEntry = {
    timestampMs: number;
    numericPrice: number;
    displayPrice: string;
};

function formatDateShort(date: Date): string {
    return date.toLocaleDateString("en-US", {month: "short", day: "numeric"});
}

function buildXAxisTicks(entries: ChartEntry[]): number[] {
    if (entries.length <= 4) {
        return entries.map((entry) => entry.timestampMs);
    }

    const lastIndex = entries.length - 1;
    const selectedIndices = [
        0,
        Math.round(lastIndex / 3),
        Math.round((2 * lastIndex) / 3),
        lastIndex,
    ];

    return [...new Set(selectedIndices.map((index) => entries[index].timestampMs))];
}

function parsePrice(price: string): number | null {
    const normalized = price.replace(/[^\d.,-]/g, "").replace(/,/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function formatLkrFromNumericPrice(price: number): string {
    const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
    return `LKR ${formatted}`;
}

type XAxisTickProps = {
    x?: number | string;
    y?: number | string;
    payload?: { value: number | string };
    index?: number;
    visibleTicksCount?: number;
};

export default function PriceHistoryChart(props: Props) {
    const chartData: ChartEntry[] = props.priceHistory
        .map((entry) => {
            const numericPrice = parsePrice(entry.price);
            if (numericPrice === null) {
                return null;
            }

            return {
                timestampMs: entry.timestamp.getTime(),
                numericPrice,
                displayPrice: entry.price,
            };
        })
        .filter((entry): entry is ChartEntry => entry !== null)
        .sort((first, second) => first.timestampMs - second.timestampMs);

    if (!chartData.length) {
        return (
            <span className="text-sm text-foreground/50">
                Not enough numeric price data to render chart.
            </span>
        );
    }

    const prices = chartData.map((entry) => entry.numericPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const xAxisTicks = buildXAxisTicks(chartData);

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{top: 8, right: 0, left: 0, bottom: 8}}>
                    <defs>
                        <linearGradient id="priceLineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22}/>
                            <stop offset="65%" stopColor="var(--accent)" stopOpacity={0.08}/>
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="4 6"
                        stroke="var(--color-border)"
                        strokeOpacity={0.28}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="timestampMs"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        ticks={xAxisTicks}
                        interval={0}
                        tickMargin={8}
                        tick={(tickProps: XAxisTickProps) => {
                            const {x = 0, y = 0, payload, index = 0, visibleTicksCount = 0} = tickProps;
                            const xValue = typeof x === "number" ? x : Number.parseFloat(x) || 0;
                            const yValue = typeof y === "number" ? y : Number.parseFloat(y) || 0;
                            const rawTimestamp = payload?.value;
                            const timestamp = typeof rawTimestamp === "number"
                                ? rawTimestamp
                                : Number.parseFloat(rawTimestamp ?? "") || 0;
                            const isFirstTick = index === 0;
                            const isLastTick = index === visibleTicksCount - 1;
                            const textAnchor = isFirstTick ? "start" : isLastTick ? "end" : "middle";
                            const dx = isFirstTick ? 0 : isLastTick ? 0 : 0;

                            return (
                                <text
                                    x={xValue + dx}
                                    y={yValue}
                                    dy={16}
                                    textAnchor={textAnchor}
                                    fontSize={12}
                                    fill="var(--color-muted-foreground)"
                                >
                                    {formatDateShort(new Date(timestamp))}
                                </text>
                            );
                        }}
                        tickLine={false}
                        axisLine={{stroke: "var(--color-border)"}}
                    />
                    <YAxis
                        hide
                        tick={{fontSize: 12, fill: "var(--color-muted-foreground)"}}
                        tickLine={false}
                        axisLine={{stroke: "var(--color-border)"}}
                        domain={[minPrice * 0.9, maxPrice * 1.1]}
                        tickFormatter={(value: number) => value.toFixed(0)}
                    />
                    <Tooltip
                        cursor={{stroke: "var(--accent)", strokeOpacity: 0.2}}
                        content={({active, payload, label}) => {
                            if (!active || !payload?.length) {
                                return null;
                            }

                            const numericPrice = payload[0]?.payload?.numericPrice;
                            if (typeof numericPrice !== "number") {
                                return null;
                            }

                            return (
                                <div
                                    style={{
                                        backgroundColor: "var(--color-popover)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-popover-foreground)",
                                    }}
                                    className="rounded-md px-3 py-2 text-sm font-medium shadow-sm"
                                >
                                    {`${formatDateShort(new Date(Number(label)))}: ${formatLkrFromNumericPrice(numericPrice)}`}
                                </div>
                            );
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="numericPrice"
                        stroke="none"
                        fill="url(#priceLineGradient)"
                    />
                    <Line
                        type="monotone"
                        dataKey="numericPrice"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}