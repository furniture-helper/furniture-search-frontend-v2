import {Product} from "@/types/ProductTypes";
import {useEffect, useState} from "react";
import {normalizeUrl} from "@/utils/url-utils";

export type UseProductResult = {
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
}

export function useProduct(url: string | null): UseProductResult {
    const [product, setProduct] = useState<Product | null>(null);
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
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?url=${encodeURIComponent(url)}`
                );

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

                    const product: Product = {
                        url: data.url,
                        title: data.title,
                        price: parsedPrice,
                        imageUrl: normalizedImageUrl || "/assets/no_image_available.jpg",
                        availability: data.in_stock || false,
                    }
                    setProduct(product);
                }
            } catch (err) {
                if (isActive) {
                    setError(err instanceof Error ? err.message : "Failed to load product");
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
        product: hasUrl ? product : null,
        isLoading: hasUrl ? isLoading : false,
        error: hasUrl ? error : "No URL provided",
    };
}
