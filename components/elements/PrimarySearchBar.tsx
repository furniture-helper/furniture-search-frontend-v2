import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {ArrowRightIcon, SearchIcon} from "lucide-react"
import {Button} from "@/components/ui/button"

export default function PrimarySearchBar() {
    return (
        <InputGroup
            className="bg-foreground-accent focus-within:bg-white rounded-none py-7 px-2 border focus:outline-none focus:shadow-none focus-visible:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-foreground/20">

            <InputGroupInput
                className="focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:border-transparent"/>

            <InputGroupAddon align="inline-start">
                <SearchIcon className="mr-2"/>
            </InputGroupAddon>

            <InputGroupAddon align="inline-end">
                <Button variant="default" className="rounded-none bg-accent cursor-pointer hover:bg-accent/80">
                    <ArrowRightIcon className="text-accent-foreground"/>
                </Button>
            </InputGroupAddon>

        </InputGroup>
    )
}