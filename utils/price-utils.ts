export function formatPriceWithCommas(price: number): string {
    return new Intl.NumberFormat("en-US").format(price);
}