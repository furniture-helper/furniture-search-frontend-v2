import {Product} from "@/types/ProductTypes";
import {useSimilarProducts} from "@/hooks/useSimilarProducts";
import SimilarProductsEntry from "@/components/elements/SimilarProductEntry";

export type Props = {
    product: Product;
}

export default function SimilarProducts(props: Props) {
    const {similarProducts, isLoading, error} = useSimilarProducts(props.product.url, 0.3, 0.7);
    const uniqueRetailers = Array.from(new Set(similarProducts.map(p => new URL(p.product.url).hostname)));

    return (
        <div className="flex flex-col gap-2 border-foreground/10 p-2">
            <span className="font-serif text-lg">Compare</span>
            <span
                className="font-light text-sm text-foreground/50 -mt-3">{similarProducts.length} similar product{similarProducts.length !== 1 ? "s" : ""} are also available at {uniqueRetailers.length} other retailer{uniqueRetailers.length !== 1 ? "s" : ""}</span>
            {error ? (
                <span className="text-sm text-red-500">{error}</span>
            ) : isLoading ? (
                <span className="text-sm text-foreground/50">Loading comparisons...</span>
            ) : similarProducts.length ? (
                <div className="flex flex-col gap-4">
                    {similarProducts.map((entry, index) => (
                        <SimilarProductsEntry key={index} product={entry.product}
                                              confidence={entry.cosine_similarity_finetuned_768}/>
                    ))}
                </div>
            ) : (
                <span className="text-sm text-foreground/50">No similar products found.</span>
            )}
        </div>
    )
}