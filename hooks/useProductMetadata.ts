import {ProductMetadata} from "@/types/ProductTypes";
import {useEffect, useState} from "react";

export type UseProductMetadataResult = {
    metadata: ProductMetadata | null;
    isLoading: boolean;
    error: string | null;
};

type ProductMetadataApiResponse = {
    url: string;
    s3_key: string | null;
    detected_at: string | null;
    last_crawled_at: string | null;
    last_minimized_at: string | null;
    last_classified_at: string | null;
    last_inferred_at: string | null;
};

export function useProductMetadata(url: string | null): UseProductMetadataResult {
    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
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

                const res = await fetch(
                    `${apiBaseUrl}/products/metadata?url=${encodeURIComponent(url)}`
                );

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                const data: ProductMetadataApiResponse | null = await res.json();
                if (!data) {
                    throw new Error("Product metadata not found");
                }

                if (isActive) {
                    setMetadata({
                        url: data.url,
                        s3_key: data.s3_key,
                        detected_at: data.detected_at ? new Date(data.detected_at) : null,
                        last_crawled_at: data.last_crawled_at ? new Date(data.last_crawled_at) : null,
                        last_minimized_at: data.last_minimized_at ? new Date(data.last_minimized_at) : null,
                        last_classified_at: data.last_classified_at ? new Date(data.last_classified_at) : null,
                        last_inferred_at: data.last_inferred_at ? new Date(data.last_inferred_at) : null,
                    });
                }
            } catch (err) {
                if (isActive) {
                    setMetadata(null);
                    setError(err instanceof Error ? err.message : "Failed to load product metadata");
                }
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
        metadata: hasUrl ? metadata : null,
        isLoading: hasUrl ? isLoading : false,
        error: hasUrl ? error : "No URL provided",
    };
}