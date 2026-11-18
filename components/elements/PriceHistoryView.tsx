import {Product} from "@/types/ProductTypes";
import {usePriceHistory} from "@/hooks/usePriceHistory";
import PriceHistoryChart from "@/components/elements/PriceHistoryChart";
import PriceSummary from "@/components/elements/PriceSummary";

export type Props = {
    product: Product;
}

export default function PriceHistoryView(props: Props) {
    const {priceHistory, isLoading, error} = usePriceHistory(props.product.url);

    return (
        <div className="flex flex-col gap-2 border-foreground/10 p-2">
            <span className="font-serif text-lg">Price History</span>
            <span
                className="font-light text-sm text-foreground/50">Tracked price history over the last 90 days</span>
            {error ? (
                <span className="text-sm text-red-500">{error}</span>
            ) : isLoading ? (
                <span className="text-sm text-foreground/50">Loading price history...</span>
            ) : priceHistory.length ? (
                <div className="flex flex-col gap-1">
                    <PriceSummary priceHistory={priceHistory}/>
                    <PriceHistoryChart priceHistory={priceHistory}/>
                </div>
            ) : (
                <span className="text-sm text-foreground/50">No price history found.</span>
            )}
        </div>
    )
}