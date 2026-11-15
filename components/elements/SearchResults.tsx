"use client"

import {useSearchResults} from "@/hooks/useSearchResults";
import PrimarySearchBar from "@/components/elements/PrimarySearchBar";
import ProductGroupListing from "@/components/elements/ProductGroupListing";

export type Props = {
    searchQuery: string
}

export default function SearchResults({searchQuery}: Props) {
    const {searchResults, isLoading, error} = useSearchResults(searchQuery);

    return (
        <div className="flex flex-col gap-4 p-5">

            <PrimarySearchBar searchQuery={decodeURIComponent(searchQuery).replaceAll("-", " ")}/>

            {error ? (
                <span className="text-red-500">{error}</span>
            ) : isLoading ? (
                <span>Loading...</span>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((productGroup, index) => (
                        <ProductGroupListing key={index} products={productGroup}/>
                    ))}
                </div>
            )}
        </div>
    )
}