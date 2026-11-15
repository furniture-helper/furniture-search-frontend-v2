export type Product = {
    url: string;
    title: string;
    price: number;
    imageUrl: string;
    availability: boolean;
}

export type ProductSearchResults = {
    products: Product[];
}