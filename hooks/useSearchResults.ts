import {useEffect, useMemo, useState} from "react";
import {normalizeUrl} from "@/utils/url-utils";
import {Product} from "@/types/ProductTypes";

type ProductSearchResponse = {
    url: string;
    title: string;
    price: number;
    image_url?: string | null;
    availability: boolean;
};

export type UseSearchResultsResult = {
    searchQueryUnencoded: string;
    searchResults: Product[];
    isLoading: boolean;
    error: string | null;
};

export function useSearchResults(searchQuery: string): UseSearchResultsResult {
    const searchQueryUnencoded = useMemo(
        () => decodeURIComponent(searchQuery).replaceAll("-", " "),
        [searchQuery]
    );
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?query=${searchQueryUnencoded}`
                );

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                const data: ProductSearchResponse[] = await res.json();

                if (!isActive) {
                    return;
                }

                setSearchResults(
                    data.map((product) => {
                        const normalizedImageUrl = normalizeUrl(product.image_url ?? "");

                        return {
                            url: product.url,
                            title: product.title,
                            price: product.price,
                            imageUrl: normalizedImageUrl || "/assets/no_image_available.jpg",
                            availability: product.availability,
                        };
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
        searchQueryUnencoded,
        searchResults,
        isLoading,
        error,
    };
}
