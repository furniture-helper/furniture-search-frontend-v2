import {Product} from "@/types/ProductTypes";
import {useEffect, useState} from "react";
import {normalizeUrl} from "@/utils/url-utils";

export type UseRandomProductResult = {
    product: Product | null;
    isLoading: boolean;
    error: string | null;
};

export type ProductApiResponse = {
    url: string;
    title: string;
    price: string;
    image_url?: string | null;
    in_stock: boolean | null;
};

export function useRandomProduct(): UseRandomProductResult {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
                if (!apiBaseUrl) {
                    throw new Error("API base URL is not configured");
                }

                const randomEndpoint = `${apiBaseUrl}/products/random`;
                const res = await fetch(randomEndpoint, {cache: "no-store"});

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                const data: ProductApiResponse | null = await res.json();
                if (!data) {
                    throw new Error("Product not found");
                }

                if (isActive) {
                    const normalizedImageUrl = normalizeUrl(data.image_url ?? "");
                    const parsedPrice = Number.parseFloat(data.price);

                    setProduct({
                        url: data.url,
                        title: data.title,
                        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
                        imageUrl: normalizedImageUrl || "/assets/no_image_available.jpg",
                        availability: data.in_stock ?? false,
                    });
                }
            } catch (err) {
                if (isActive) {
                    setProduct(null);
                    setError(err instanceof Error ? err.message : "Failed to load random product");
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
    }, []);

    return {product, isLoading, error};
}
