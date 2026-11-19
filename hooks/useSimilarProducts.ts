import {useEffect, useState} from "react";
import {SimilarProductEntry} from "@/types/ProductTypes";
import {normalizeUrl} from "@/utils/url-utils";

export type UseSimilarProductsResult = {
    similarProducts: SimilarProductEntry[];
    isLoading: boolean;
    error: string | null;
};

type ProductApiResponse = {
    url: string;
    title: string;
    price: string;
    image_url?: string | null;
    in_stock: boolean | null;
};

type SimilarProductApiEntry = {
    product: ProductApiResponse;
    title_similarity: string | number;
    cosine_similarity?: string | number | null;
    combined_similarity: string | number;
    cosine_similarity_finetuned_768: string | number;
};

type SimilarProductsApiResponse = SimilarProductApiEntry[] | {
    products: SimilarProductApiEntry[];
};

function isProductApiResponse(data: unknown): data is ProductApiResponse {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const value = data as Record<string, unknown>;
    return (
        typeof value.url === "string" &&
        typeof value.title === "string" &&
        typeof value.price === "string" &&
        (typeof value.in_stock === "boolean" || value.in_stock === null)
    );
}

function isSimilarProductApiEntry(data: unknown): data is SimilarProductApiEntry {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const value = data as Record<string, unknown>;
    return (
        isProductApiResponse(value.product) &&
        (typeof value.title_similarity === "number" || typeof value.title_similarity === "string") &&
        (
            value.cosine_similarity === undefined ||
            value.cosine_similarity === null ||
            typeof value.cosine_similarity === "number" ||
            typeof value.cosine_similarity === "string"
        ) &&
        (typeof value.combined_similarity === "number" || typeof value.combined_similarity === "string") &&
        (
            typeof value.cosine_similarity_finetuned_768 === "number" ||
            typeof value.cosine_similarity_finetuned_768 === "string"
        )
    );
}

function isSimilarProductsResponse(data: unknown): data is SimilarProductsApiResponse {
    if (Array.isArray(data)) {
        return data.every(isSimilarProductApiEntry);
    }

    if (typeof data !== "object" || data === null) {
        return false;
    }

    const value = data as Record<string, unknown>;
    return Array.isArray(value.products) && value.products.every(isSimilarProductApiEntry);
}

function getSimilarProductEntries(data: SimilarProductsApiResponse): SimilarProductApiEntry[] {
    if (Array.isArray(data)) {
        return data;
    }

    return data.products;
}

function mapApiEntryToSimilarProduct(entry: SimilarProductApiEntry): SimilarProductEntry {
    const parseMetric = (value: string | number | null | undefined): number => {
        if (typeof value === "number") {
            return Number.isFinite(value) ? value : 0;
        }

        if (typeof value === "string") {
            const parsed = Number.parseFloat(value);
            return Number.isFinite(parsed) ? parsed : 0;
        }

        return 0;
    };
    const parseMetricOrNull = (value: string | number | null | undefined): number | null => {
        if (typeof value === "number") {
            return Number.isFinite(value) ? value : null;
        }

        if (typeof value === "string") {
            const parsed = Number.parseFloat(value);
            return Number.isFinite(parsed) ? parsed : null;
        }

        return null;
    };

    const normalizedImageUrl = normalizeUrl(entry.product.image_url ?? "");
    const parsedPrice = Number.parseFloat(entry.product.price);
    const cosineSimilarityFinetuned = parseMetric(entry.cosine_similarity_finetuned_768);
    const cosineSimilarity = parseMetricOrNull(entry.cosine_similarity);

    return {
        product: {
            url: entry.product.url,
            title: entry.product.title,
            price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
            imageUrl: normalizedImageUrl || "/assets/no_image_available.jpg",
            availability: entry.product.in_stock ?? false,
        },
        title_similarity: parseMetric(entry.title_similarity),
        cosine_similarity: cosineSimilarity ?? cosineSimilarityFinetuned,
        combined_similarity: parseMetric(entry.combined_similarity),
        cosine_similarity_finetuned_768: cosineSimilarityFinetuned,
    };
}

export function useSimilarProducts(
    productUrl: string | null,
    titleSimilarityThreshold: number,
    cosineSimilarityThreshold: number
): UseSimilarProductsResult {
    const [similarProducts, setSimilarProducts] = useState<SimilarProductEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasUrl = Boolean(productUrl);

    useEffect(() => {
        if (!productUrl) {
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

                const url = new URL(`${apiBaseUrl}/products/similar`);
                url.searchParams.set("url", productUrl);
                url.searchParams.set("title_similarity_threshold", String(titleSimilarityThreshold));
                url.searchParams.set("cosine_similarity_threshold", String(cosineSimilarityThreshold));

                const res = await fetch(url.toString());
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                const data: unknown = await res.json();
                if (!isSimilarProductsResponse(data)) {
                    throw new Error("Unexpected similar products response format");
                }

                if (!isActive) {
                    return;
                }

                const entries = getSimilarProductEntries(data);
                setSimilarProducts(entries.map(mapApiEntryToSimilarProduct));
            } catch (err) {
                if (!isActive) {
                    return;
                }

                setSimilarProducts([]);
                setError(err instanceof Error ? err.message : "Failed to load similar products");
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
    }, [cosineSimilarityThreshold, productUrl, titleSimilarityThreshold]);

    return {
        similarProducts: hasUrl ? similarProducts : [],
        isLoading: hasUrl ? isLoading : false,
        error: hasUrl ? error : "No URL provided",
    };
}