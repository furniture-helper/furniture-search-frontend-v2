import Image from "next/image"
import {formatPriceWithCommas} from "@/utils/price-utils";
import {Button} from "@/components/ui/button";
import {ArrowRightIcon} from "lucide-react";

export type Props = {
    title: string
    price: number
    imageUrl: string
    availability: boolean
}

export default function ProductListing(props: Props) {
    return (
        <div className="flex flex-col gap-2 border-foreground/10 border-b-2 p-2 items-center mb-5 rounded-sm">
            <Image src={props.imageUrl}
                   alt={props.title}
                   width={200}
                   height={200}
                   className="h-[200px] w-[200px] object-cover"
            />
            <div className="flex flex-col gap-4 w-full">
                <span className="font-serif font-light text-2xl">{props.title}</span>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-0">
                        <span className="text-xs text-foreground/50">Best price</span>
                        <span className="font-bold text-lg">LKR {formatPriceWithCommas(props.price)}</span>
                    </div>

                    <Button variant="default" className="rounded-none bg-accent cursor-pointer hover:bg-accent/80 py-5">
                        <span className="font-bold text-xs">See details</span>
                        <ArrowRightIcon className="text-accent-foreground"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}