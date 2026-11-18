export type Product = {
    url: string;
    title: string;
    price: number;
    imageUrl: string;
    availability: boolean;
}

export type ProductGroup = Product[];

export type ProductSearchResults = {
    products: Product[];
}

export type PriceHistoryEntry = {
    timestamp: Date;
    price: string;
}

export type ProductMetadata = {
    url: string;
    s3_key: string | null;
    detected_at: Date | null;
    last_crawled_at: Date | null;
    last_minimized_at: Date | null;
    last_classified_at: Date | null;
    last_inferred_at: Date | null;
}
