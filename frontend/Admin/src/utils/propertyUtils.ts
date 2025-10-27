/**
 * Format a price value with Naira currency symbol and proper formatting
 * @param price - The price to format (number or string)
 * @returns Formatted price string with Naira symbol
 */
export function formatPrice(price: string | number): string {
  if (typeof price === "string") {
    const numeric = price.replace(/[^\d.]/g, "");
    let num = parseFloat(numeric);
    if (price.toUpperCase().includes("M")) {
      num *= 1_000_000;
    }
    if (isNaN(num)) return "₦0";
    return `₦${num.toLocaleString()}`;
  } else if (typeof price === "number") {
    return `₦${price.toLocaleString()}`;
  }
  return "₦0";
}

/**
 * Get the appropriate rank image based on agent rank
 * @param rank - The agent's rank
 * @returns The path to the appropriate rank image
 */
export function rankImage(rank: string): string {
  switch (rank?.toLowerCase()) {
    case "bronze":
      return "/icons/Bronze.png";
    case "silver":
      return "/icons/Silver.png";
    case "gold":
      return "/icons/Gold.png";
    case "platinum":
      return "/icons/Platinum.png";
    case "diamond":
      return "/icons/Diamond.png";
    default:
      return "/icons/Silver.png";
  }
}