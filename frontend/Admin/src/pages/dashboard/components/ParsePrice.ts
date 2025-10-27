import { parsePriceString } from "@/utils/priceFormatter";

export function parsePrice(price: string | number): number {
  // Convert number to string before passing to parsePriceString
  return parsePriceString(typeof price === 'number' ? price.toString() : price);
}

// Add default export to prevent Next.js page error
export default parsePrice;