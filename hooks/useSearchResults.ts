import {useEffect, useMemo, useState} from "react";
import {normalizeUrl} from "@/utils/url-utils";
import {ProductGroup} from "@/types/ProductTypes";

type ProductSearchItemResponse = {
    url: string;
    title: string;
    price: string;
    image_url?: string | null;
    in_stock: boolean | null;
};

type ProductSearchGroupResponse = {
    products: ProductSearchItemResponse[];
};

export type UseSearchResultsResult = {
    searchResults: ProductGroup[];
    isLoading: boolean;
    error: string | null;
};

function isProductSearchResponse(data: unknown): data is ProductSearchGroupResponse[] {
    return Array.isArray(data) && data.every((group) => Array.isArray(group?.products));
}

export function useSearchResults(searchQuery: string): UseSearchResultsResult {
    const searchQueryUnencoded = useMemo(
        () => decodeURIComponent(searchQuery).replaceAll("-", " "),
        [searchQuery]
    );
    const [searchResults, setSearchResults] = useState<ProductGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search-grouped?query=${searchQueryUnencoded}`
                );

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                const data: unknown = await res.json();
                if (!isProductSearchResponse(data)) {
                    throw new Error("Unexpected search response format");
                }

                if (!isActive) {
                    return;
                }

                setSearchResults(
                    data.map((group) => {
                        return group.products.map((product) => {
                            const normalizedImageUrl = normalizeUrl(product.image_url ?? "");
                            const parsedPrice = Number.parseFloat(product.price);

                            return {
                                url: product.url,
                                title: product.title,
                                price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
                                imageUrl: normalizedImageUrl || "/assets/no_image_available.jpg",
                                availability: product.in_stock ?? false,
                            };
                        });
                    })
                );
            } catch (err) {
                if (!isActive) {
                    return;
                }

                setSearchResults([]);
                setError(err instanceof Error ? err.message : "Failed to load search results");
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
    }, [searchQueryUnencoded]);

    return {
        searchResults,
        isLoading,
        error,
    };
}
