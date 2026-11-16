"use client"

import {useProduct} from "@/hooks/useProduct";
import {useSearchParams} from "next/navigation";
import ProductView from "@/components/elements/ProductView";
import PrimarySearchBar from "@/components/elements/PrimarySearchBar";

export default function Product() {
    const params = useSearchParams();

    const url = params.get("url");
    const {product, isLoading, error} = useProduct(url);

    return (
        <div className="flex flex-col p-5">
            <PrimarySearchBar searchQuery={product?.title || ""}/>

            <div className="flex flex-col">
                {error ? (
                    <span className="text-red-500">{error}</span>
                ) : isLoading ? (
                    <span>Loading...</span>
                ) : product ? (
                    <ProductView product={product}/>
                ) : (
                    <span>Product not found</span>
                )}
            </div>
        </div>
    );
}
