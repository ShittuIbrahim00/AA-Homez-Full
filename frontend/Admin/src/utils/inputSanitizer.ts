/**
 * Sanitize user input to prevent XSS and other security issues
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "");
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Remove javascript: links
  sanitized = sanitized.replace(/javascript:/gi, "");
  
  // Remove data: links
  sanitized = sanitized.replace(/data:/gi, "");
  
  // Remove on-event attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitize input specifically for numbers
 * @param input - The input string to sanitize
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumberInput(input: string): number | null {
  if (!input) return null;
  
  // Remove all non-numeric characters except decimal point
  const sanitized = input.replace(/[^0-9.]/g, "");
  
  // Convert to number
  const num = parseFloat(sanitized);
  
  // Check if it's a valid number
  return isNaN(num) ? null : num;
}

/**
 * Sanitize input for email addresses
 * @param input - The input string to sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmailInput(input: string): string {
  if (!input) return "";
  
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = input.trim().toLowerCase();
  
  return emailRegex.test(sanitized) ? sanitized : "";
}

/**
 * Sanitize input for phone numbers
 * @param input - The input string to sanitize
 * @returns Sanitized phone number or empty string if invalid
 */
export function sanitizePhoneInput(input: string): string {
  if (!input) return "";
  
  // Remove all non-digit characters except + for country code
  const sanitized = input.replace(/[^0-9+]/g, "");
  
  // Ensure it starts with + or a digit
  if (sanitized.length > 0 && !sanitized.startsWith("+") && !/^\d/.test(sanitized)) {
    return "";
  }
  
  return sanitized;
}

/**
 * Sanitize input for text areas (allowing some HTML)
 * @param input - The input string to sanitize
 * @param allowBasicHtml - Whether to allow basic HTML tags like <br>, <p>
 * @returns Sanitized string
 */
export function sanitizeTextAreaInput(input: string, allowBasicHtml: boolean = false): string {
  if (!input) return "";
  
  let sanitized = input;
  
  if (allowBasicHtml) {
    // Allow only basic HTML tags
    sanitized = sanitized.replace(/<(?!\/?(p|br|strong|em|ul|ol|li|b|i)\b)[^>]*>/gi, "");
  } else {
    // Remove all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, "");
  }
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Remove javascript: links
  sanitized = sanitized.replace(/javascript:/gi, "");
  
  // Remove data: links
  sanitized = sanitized.replace(/data:/gi, "");
  
  // Remove on-event attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}