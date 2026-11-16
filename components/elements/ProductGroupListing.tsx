import Image from "next/image"
import {formatPriceWithCommas} from "@/utils/price-utils";
import {Button} from "@/components/ui/button";
import {ArrowRightIcon} from "lucide-react";
import {ProductGroup} from "@/types/ProductTypes";
import {getDomainFromUrl} from "@/utils/url-utils";
import {sanitizeTextForUrl} from "@/utils/text-utils";

export type Props = {
    products: ProductGroup;
}

export default function ProductGroupListing(props: Props) {
    const bestPriceProduct = props.products.reduce((prev, current) => {
        const prevPrice = prev.price;
        const currentPrice = current.price;

        return currentPrice < prevPrice ? current : prev;
    });

    return (
        <div className="flex flex-col gap-2 border-foreground/10 border-b-2 p-2 items-center mb-5 rounded-sm">
            <Image src={bestPriceProduct.imageUrl}
                   alt={bestPriceProduct.title}
                   width={200}
                   height={200}
                   className="h-[200px] w-[200px] object-cover"
            />
            <div className="flex flex-col gap-0 w-full mt-5">

                <div className="flex flex-row text-xs text-foreground/50">
                    <span>Available at {getDomainFromUrl(bestPriceProduct.url)}</span>
                    {props.products.length > 1 && (
                        <span
                            className="text-xs text-foreground/50">&nbsp;+ {props.products.length} more</span>
                    )}
                </div>

                <span className="font-serif font-light text-xl">{bestPriceProduct.title}</span>
                <div className="flex flex-row justify-between mt-5">
                    <div className="flex flex-col gap-0">
                        <span className="text-xs text-foreground/50">Best price</span>
                        <span
                            className="font-bold text-md tracking-[0.05em] leading-relaxed">LKR {formatPriceWithCommas(bestPriceProduct.price)}</span>
                    </div>

                    <a href={`/products/${sanitizeTextForUrl(bestPriceProduct.title)}?url=${encodeURIComponent(bestPriceProduct.url)}`}>
                        <Button variant="default"
                                className="rounded-none bg-accent cursor-pointer hover:bg-accent/80 py-5">
                            <span className="font-bold text-xs">See details</span>
                            <ArrowRightIcon className="text-accent-foreground"/>
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}