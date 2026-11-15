import SearchResults from "@/components/elements/SearchResults";

export const instant = false

export default async function Search({params}: {
    params: Promise<{ 'search-query': string }>
}) {
    const {['search-query']: searchQuery} = await params

    return (
        <SearchResults searchQuery={searchQuery}/>
    );
}
