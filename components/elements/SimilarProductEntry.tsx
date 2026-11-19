"use client";

import {useState} from "react";
import {Product} from "@/types/ProductTypes";
import {getDomainFromUrl} from "@/utils/url-utils";
import {formatPriceWithCommas} from "@/utils/price-utils";
import StockDot from "@/components/elements/StockDot";
import Image from "next/image";

export type Props = {
    product: Product;
    confidence: number;
}

export default function SimilarProductsEntry(props: Props) {
    const fallbackImage = "/assets/no_image_available.jpg";
    const [imageSrc, setImageSrc] = useState(props.product.imageUrl);

    return (
        <a href={props.product.url}>
            <div className="flex flex-row gap-2 p-2 border-b-1 border-foreground/10">
                <Image src={imageSrc}
                       alt={props.product.title}
                       width={50}
                       height={50}
                       className="h-[50px] w-[50px] object-cover mt-1"
                       onError={() => {
                           if (imageSrc !== fallbackImage) {
                               setImageSrc(fallbackImage);
                           }
                       }}
                />

                <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full justify-between">
                        <span className="font-bold text-sm">{props.product.title}</span>
                        <StockDot availability={props.product.availability}/>
                    </div>
                    <div className="flex flex-row gap-2 justify-between">
                        <div className="flex flex-col gap-2">
                        <span
                            className="font-light text-sm text-foreground/50">{getDomainFromUrl(props.product.url)}</span>
                            <span
                                className="font-bold text-sm text-foreground/50">LKR {formatPriceWithCommas(props.product.price)}</span>
                        </div>
                    </div>

                    <div className="flex flex-row text-xs text-foreground/40">
                        <span>Confidence: {props.confidence.toFixed(2)}</span>
                    </div>

                </div>
            </div>
        </a>
    )
}