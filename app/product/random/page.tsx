"use client"

import ProductView from "@/components/elements/ProductView";
import PrimarySearchBar from "@/components/elements/PrimarySearchBar";
import {Suspense} from "react";
import PriceHistoryView from "@/components/elements/PriceHistoryView";
import {useRandomProduct} from "@/hooks/useRandomProduct";

function ProductContent() {
    const {product, isLoading, error} = useRandomProduct();

    return (
        <div className="flex flex-col p-5">
            <PrimarySearchBar searchQuery={product?.title || ""}/>

            <div className="flex flex-col">
                {error ? (
                    <span className="text-red-500">{error}</span>
                ) : isLoading ? (
                    <span>Loading...</span>
                ) : product ? (
                    <div className={"flex flex-col gap-5"}>
                        <ProductView product={product}/>
                        <PriceHistoryView product={product}/>
                    </div>
                ) : (
                    <span>Product not found</span>
                )}
            </div>
        </div>
    );
}

export default function Product() {
    return (
        <Suspense fallback={<span>Loading...</span>}>
            <ProductContent/>
        </Suspense>
    );
}
