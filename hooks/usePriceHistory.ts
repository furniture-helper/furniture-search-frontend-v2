import {useEffect, useState} from "react";
import {PriceHistoryEntry} from "@/types/ProductTypes";

type PriceHistoryApiEntry = {
    timestamp: string;
    price: string;
};

export type UsePriceHistoryResult = {
    priceHistory: PriceHistoryEntry[];
    isLoading: boolean;
    error: string | null;
};

function isPriceHistoryResponse(data: unknown): data is PriceHistoryApiEntry[] {
    return Array.isArray(data) && data.every((entry) => (
        typeof entry?.timestamp === "string" &&
        typeof entry?.price === "string"
    ));
}

export function usePriceHistory(url: string | null): UsePriceHistoryResult {
    const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasUrl = Boolean(url);

    useEffect(() => {
        if (!url) {
            return;
        }

        let isActive = true;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
                if (!apiBaseUrl) {
                    throw new Error("API base URL is not configured");
                }

                const priceHistoryResponse = await fetch(
                    `${apiBaseUrl}/products/price-history?url=${encodeURIComponent(url)}`,
                    {cache: "no-store"}
                );

                if (!priceHistoryResponse.ok) {
                    throw new Error(`Request failed with status ${priceHistoryResponse.status}`);
                }

                const data: unknown = await priceHistoryResponse.json();
                if (!isPriceHistoryResponse(data)) {
                    throw new Error("Unexpected price history response format");
                }

                if (!isActive) {
                    return;
                }

                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - 90);

                setPriceHistory(
                    data
                        .map((entry) => ({
                            timestamp: new Date(entry.timestamp),
                            price: entry.price,
                        }))
                        .filter((entry) => !Number.isNaN(entry.timestamp.getTime()) && entry.timestamp >= cutoff)
                );
            } catch (err) {
                if (!isActive) {
                    return;
                }

                setPriceHistory([]);
                setError(err instanceof Error ? err.message : "Failed to load price history");
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            isActive = false;
        };
    }, [url]);

    return {
        priceHistory: hasUrl ? priceHistory : [],
        isLoading: hasUrl ? isLoading : false,
        error: hasUrl ? error : "No URL provided",
    };
}