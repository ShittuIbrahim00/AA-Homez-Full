/**
 * Utility functions for formatting and parsing prices
 */

/**
 * Parse a price string like "2.5M" or "10.0M" into a number
 * @param priceStr - Price string from backend (e.g., "2.5M", "10K", "5000")
 * @returns Parsed number value
 */
export const parsePriceString = (priceStr: string): number => {
  if (!priceStr) return 0;
  
  const cleanStr = priceStr.trim().toUpperCase().replace(/,/g, "");
  let num = parseFloat(cleanStr);
  
  if (isNaN(num)) return 0;
  
  if (cleanStr.endsWith("K")) {
    num *= 1_000;
  } else if (cleanStr.endsWith("M")) {
    num *= 1_000_000;
  }
  
  return num;
};

/**
 * Format a number into a price string
 * @param price - Number to format
 * @param showFullPrice - Whether to show full price or use abbreviations (K/M)
 * @returns Formatted price string (e.g., "₦2,500,000" or "₦2.5M")
 */
export const formatPrice = (price: number | string, showFullPrice: boolean = false): string => {
  const num = typeof price === "string" ? parsePriceString(price) : price;
  
  if (isNaN(num) || num === 0) return "₦0";
  
  // For small amounts, always show full price
  if (num < 1000) {
    return `₦${num.toLocaleString()}`;
  }
  
  // For larger amounts, either show full price or abbreviated
  if (showFullPrice || num < 10_000) {
    return `₦${num.toLocaleString()}`;
  } else if (num < 1_000_000) {
    // Format as K for thousands
    return `₦${(num / 1_000).toFixed(1)}K`;
  } else {
    // Format as M for millions
    return `₦${(num / 1_000_000).toFixed(1)}M`;
  }
};

/**
 * Format a price range string
 * @param startPrice - Start price string (e.g., "2.5M")
 * @param endPrice - End price string (e.g., "10.0M")
 * @param showFullPrice - Whether to show full price or use abbreviations
 * @returns Formatted price range (e.g., "₦2.5M - ₦10.0M" or "₦2,500,000 - ₦10,000,000")
 */
export const formatPriceRange = (startPrice: string, endPrice: string, showFullPrice: boolean = false): string => {
  const start = parsePriceString(startPrice);
  const end = parsePriceString(endPrice);
  
  if (start === end) {
    return formatPrice(start, showFullPrice);
  }
  
  return `${formatPrice(start, showFullPrice)} - ${formatPrice(end, showFullPrice)}`;
};