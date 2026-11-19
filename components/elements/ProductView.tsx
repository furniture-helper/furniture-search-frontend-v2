import Image from "next/image"
import {Product} from "@/types/ProductTypes";
import {getDomainFromUrl} from "@/utils/url-utils";
import {getBrandLogo} from "@/utils/logo-utils";
import StockChip from "@/components/elements/StockChip";
import {formatPriceWithCommas} from "@/utils/price-utils";
import {Button} from "@/components/ui/button";
import {ExternalLinkIcon} from "lucide-react";
import LastUpdatedChip from "@/components/elements/LastUpdatedChip";

export type Props = {
    product: Product;
}

export default function ProductView(props: Props) {

    return (
        <div className="flex flex-col gap-2 border-foreground/10 p-2 items-center mt-5">
            <Image src={props.product.imageUrl}
                   alt={props.product.title}
                   width={200}
                   height={200}
                   className="h-[200px] w-[200px] object-cover"
            />
            <div className="flex flex-col gap-0 w-full mt-2">
                <span className="font-serif text-2xl text-center">{props.product.title}</span>
            </div>

            <div className="flex flex-col w-full mt-5 p-5 bg-foreground-accent gap-5">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 w-full items-center">
                        <Image src={getBrandLogo(getDomainFromUrl(props.product.url))}
                               alt={getDomainFromUrl(props.product.url)}
                               width={50}
                               height={50}
                        />
                        <span className="text-md italic">{getDomainFromUrl(props.product.url)}</span>
                    </div>

                    <StockChip availability={props.product.availability}/>
                </div>

                <span
                    className="font-bold text-3xl leading-relaxed">LKR {formatPriceWithCommas(props.product.price)}</span>

                <a href={`${props.product.url}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="default"
                            className="rounded-none bg-accent cursor-pointer hover:bg-accent/80 py-5 w-full">
                        <span className="font-bold text-xs">View on {getDomainFromUrl(props.product.url)}</span>
                        <ExternalLinkIcon className="text-accent-foreground"/>
                    </Button>
                </a>

                <LastUpdatedChip product={props.product}/>

            </div>
        </div>
    )
}