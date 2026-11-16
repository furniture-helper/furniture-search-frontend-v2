export type Props = {
    availability: boolean;
}

export default function StockChip(props: Props) {
    const bgColor = props.availability ? "bg-green-300" : "bg-red-200";
    const textColor = props.availability ? "text-green-800" : "text-red-800";
    const dotBgColor = props.availability ? "bg-green-800" : "bg-red-800";
    const text = props.availability ? "In Stock" : "Out of Stock";

    return (
        <div className={`flex flex-row h-8 ${bgColor} p-2 items-center`}>
            <div className={`w-2 h-2 rounded-full ${dotBgColor} mr-2`}></div>
            <span className={`text-xs ${textColor} font-bold whitespace-nowrap`}>{text}</span>
        </div>
    )
}