import {Product} from "@/types/ProductTypes";
import {ClockIcon} from "lucide-react";
import {useProductMetadata} from "@/hooks/useProductMetadata";
import {formatTimeAgo} from "@/utils/time-utils";

export type Props = {
    product: Product;
}

export default function LastUpdatedChip(props: Props) {
    const {metadata, isLoading} = useProductMetadata(props.product.url);

    if (isLoading || !metadata?.last_inferred_at) {
        return null;
    }

    return (
        <div className="flex flex-row items-center gap-1 text-foreground/50">
            <ClockIcon size={14}/>
            <span
                className="text-xs text-foreground/50">Last updated {formatTimeAgo(metadata.last_inferred_at)}</span>
        </div>
    )
}