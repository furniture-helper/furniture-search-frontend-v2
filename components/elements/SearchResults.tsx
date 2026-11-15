"use client"

import ProductListing from "@/components/elements/ProductListing";
import {useSearchResults} from "@/hooks/useSearchResults";
import PrimarySearchBar from "@/components/elements/PrimarySearchBar";

export type Props = {
    searchQuery: string
}

export default function SearchResults({searchQuery}: Props) {
    const {searchQueryUnencoded, searchResults, isLoading, error} = useSearchResults(searchQuery);

    return (
        <div className="flex flex-col gap-4 p-5">

            <PrimarySearchBar searchQuery={decodeURIComponent(searchQuery).replaceAll("-", " ")}/>

            {error ? (
                <span className="text-red-500">{error}</span>
            ) : isLoading ? (
                <span>Loading...</span>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((product, index) => (
                        <ProductListing key={index} title={product.title} price={product.price}
                                        imageUrl={product.imageUrl}
                                        availability={product.availability}/>
                    ))}
                </div>
            )}
        </div>
    )
}