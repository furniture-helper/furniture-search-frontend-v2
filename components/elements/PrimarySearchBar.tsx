"use client"

import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {ArrowRightIcon, SearchIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {useRouter} from "next/navigation"

export default function PrimarySearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    function handleSearch() {
        const sanitizedQuery = searchQuery.trim().replace(/\s+/g, "-").toLowerCase()
        if (!sanitizedQuery) {
            return
        }

        router.push(`/search/${encodeURIComponent(sanitizedQuery)}`)
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
            }}
            className="w-full"
        >
            <InputGroup
                className="bg-foreground-accent focus-within:bg-white rounded-none py-7 px-2 border focus:outline-none focus:shadow-none focus-visible:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-foreground/20">

                <InputGroupInput
                    className="focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:border-transparent"
                    placeholder="Product name or URL"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <InputGroupAddon align="inline-start">
                    <SearchIcon className="mr-2"/>
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <Button type="submit" variant="default" disabled={!searchQuery.trim()}
                            className="rounded-none bg-accent cursor-pointer hover:bg-accent/80">
                        <ArrowRightIcon className="text-accent-foreground"/>
                    </Button>
                </InputGroupAddon>

            </InputGroup>
        </form>
    )
}