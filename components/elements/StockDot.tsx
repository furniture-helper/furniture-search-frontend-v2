export type Props = {
    availability: boolean;
}

export default function StockDot(props: Props) {
    const bgColor = props.availability ? "bg-green-300" : "bg-red-200";
    const dotBgColor = props.availability ? "bg-green-800" : "bg-red-800";

    return (
        <div className={`flex flex-row ${bgColor} p-1 items-center rounded-full h-4 w-4`}>
            <div className={`w-2 h-2 rounded-full ${dotBgColor}`}></div>
        </div>
    )
}