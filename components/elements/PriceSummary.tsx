import {PriceHistoryEntry} from "@/types/ProductTypes";
import {formatPriceWithCommas} from "@/utils/price-utils";

export type Props = {
    priceHistory: PriceHistoryEntry[]
}


export default function PriceSummary(props: Props) {
    return (
        <div className="bg-foreground/5 p-2 flex flex-row justify-between px-5 items-center pt-3">
            <PriceSummaryRow tag="Lowest" value={getLowestPrice(props.priceHistory) ?? 0}/>
            <PriceSummaryRow tag="Current" value={getCurrentPrice(props.priceHistory) ?? 0}/>
            <PriceSummaryRow tag="Highest" value={getHighestPrice(props.priceHistory) ?? 0}/>
        </div>
    )
}

function PriceSummaryRow({tag, value}: { tag: string; value: number }) {
    return (
        <div className="flex flex-col justify-center items-center gap-1">
            <span className="font-bold text-xs text-foreground/60">{tag.toUpperCase()}</span>
            <span className="font-bold text-md text-foreground/60">LKR {formatPriceWithCommas(value)}</span>
        </div>
    )
}

function parsePrice(price: string): number | null {
    const normalized = price.replace(/[^\d.,-]/g, "").replace(/,/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function getLowestPrice(priceHistory: PriceHistoryEntry[]): number | null {
    const numericPrices = priceHistory
        .map((entry) => parsePrice(entry.price))
        .filter((price): price is number => price !== null);

    return numericPrices.length ? Math.min(...numericPrices) : null;
}

function getHighestPrice(priceHistory: PriceHistoryEntry[]): number | null {
    const numericPrices = priceHistory
        .map((entry) => parsePrice(entry.price))
        .filter((price): price is number => price !== null);

    return numericPrices.length ? Math.max(...numericPrices) : null;
}

function getCurrentPrice(priceHistory: PriceHistoryEntry[]): number | null {
    if (!priceHistory.length) {
        return null;
    }

    const latestEntry = priceHistory.reduce((latest, entry) => {
        return entry.timestamp > latest.timestamp ? entry : latest;
    });

    return parsePrice(latestEntry.price);
}