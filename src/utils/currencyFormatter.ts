/**
 * Currency formatting utility for Golden Life Platform
 * All currency values should use BDT (Bangladeshi Taka)
 * 
 * Usage:
 * - formatBDT(100) => "100 BDT"
 * - formatBDT(100, { showSymbol: false }) => "100"
 * - formatBDT(100, { prefix: true }) => "BDT 100"
 * - formatBDT(100, { compact: true }) => "100৳"
 */

interface FormatBDTOptions {
  showSymbol?: boolean;      // Show "BDT" text (default: true)
  prefix?: boolean;          // Place symbol before number (default: false)
  compact?: boolean;         // Use compact format "৳" (default: false)
  decimals?: number;         // Number of decimal places (default: 2)
  showDecimals?: boolean;    // Always show decimals (default: true)
  locale?: string;           // Locale for number formatting (default: 'en-BD')
}

/**
 * Format amount as BDT currency
 */
export const formatBDT = (
  amount: number | string,
  options: FormatBDTOptions = {}
): string => {
  const {
    showSymbol = true,
    prefix = false,
    compact = false,
    decimals = 2,
    showDecimals = true,
    locale = 'en-BD',
  } = options;

  // Convert to number if string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return showSymbol ? (compact ? '৳0' : '0 BDT') : '0';
  }

  // Format number with locale
  const formattedNumber = showDecimals
    ? numericAmount.toFixed(decimals)
    : Math.round(numericAmount).toString();

  // Add thousand separators
  const withSeparators = Number(formattedNumber).toLocaleString(locale, {
    minimumFractionDigits: showDecimals ? decimals : 0,
    maximumFractionDigits: decimals,
  });

  // Build final string
  if (compact) {
    return `৳${withSeparators}`;
  }

  if (!showSymbol) {
    return withSeparators;
  }

  return prefix ? `BDT ${withSeparators}` : `${withSeparators} BDT`;
};

/**
 * Remove $ sign from any string and convert to BDT format
 * Useful for cleaning API responses or hardcoded strings
 */
export const cleanCurrencyString = (str: string): string => {
  if (!str) return str;
  
  // Remove $ sign and trim
  const cleaned = str.replace(/\$/g, '').trim();
  
  // Try to parse as number
  const num = parseFloat(cleaned.replace(/,/g, ''));
  
  if (!isNaN(num)) {
    return formatBDT(num);
  }
  
  // If not a number, just return cleaned string
  return cleaned;
};

/**
 * Format price range
 * Example: formatPriceRange(10, 20) => "10 - 20 BDT"
 */
export const formatPriceRange = (
  min: number | string,
  max: number | string,
  options?: FormatBDTOptions
): string => {
  const minFormatted = formatBDT(min, { ...options, showSymbol: false });
  const maxFormatted = formatBDT(max, { ...options, showSymbol: false });
  
  return `${minFormatted} - ${maxFormatted} BDT`;
};

/**
 * Format discount price with original and discounted
 * Example: formatDiscount(100, 80) => { original: "100 BDT", discounted: "80 BDT", savings: "20 BDT" }
 */
export const formatDiscount = (
  originalPrice: number | string,
  discountedPrice: number | string
) => {
  const original = parseFloat(String(originalPrice));
  const discounted = parseFloat(String(discountedPrice));
  
  if (isNaN(original) || isNaN(discounted)) {
    return {
      original: formatBDT(0),
      discounted: formatBDT(0),
      savings: formatBDT(0),
      percentage: 0,
    };
  }

  const savings = original - discounted;
  const percentage = original > 0 ? ((savings / original) * 100).toFixed(0) : 0;

  return {
    original: formatBDT(original),
    discounted: formatBDT(discounted),
    savings: formatBDT(savings),
    percentage: parseInt(percentage),
  };
};

/**
 * Extract number from currency string
 * Example: extractCurrencyNumber("$100") => 100
 */
export const extractCurrencyNumber = (str: string): number => {
  if (!str) return 0;
  
  const cleaned = str.replace(/[\$\,\s]/g, '');
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? 0 : num;
};

/**
 * Legacy formatPrice function (updated to use BDT)
 * For backward compatibility with existing code
 */
export const formatPrice = (
  price: number,
  currency: string = 'BDT'
): string => {
  return formatBDT(price, { compact: currency === '৳' });
};

/**
 * Quick formatting presets
 */
export const CurrencyPresets = {
  // Full format: "1,234.56 BDT"
  full: (amount: number | string) => formatBDT(amount, { showSymbol: true, prefix: false }),
  
  // Compact format: "৳1,234.56"
  compact: (amount: number | string) => formatBDT(amount, { compact: true }),
  
  // Number only: "1,234.56"
  number: (amount: number | string) => formatBDT(amount, { showSymbol: false }),
  
  // Prefix format: "BDT 1,234.56"
  prefix: (amount: number | string) => formatBDT(amount, { prefix: true }),
  
  // No decimals: "1,235 BDT"
  noDecimals: (amount: number | string) => formatBDT(amount, { showDecimals: false }),
  
  // For charts/graphs (compact, no decimals)
  chart: (amount: number | string) => formatBDT(amount, { compact: true, showDecimals: false }),
};
