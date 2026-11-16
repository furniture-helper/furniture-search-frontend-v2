import {Product} from "@/types/ProductTypes";

export function filterAnomalies(products: Product[]): Product[] {
    // Removes products where the price is not a valid number, or 0, or is one standard deviation away from the mean price
    const validProducts = products.filter(product => {
        const price = product.price;
        return !isNaN(price) && price > 0;
    });

    if (validProducts.length === 0) {
        return [];
    }

    const prices = validProducts.map(product => product.price);
    const meanPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const stdDevPrice = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0) / prices.length);

    return validProducts.filter(product => {
        const price = product.price;
        return Math.abs(price - meanPrice) <= stdDevPrice;
    });
}