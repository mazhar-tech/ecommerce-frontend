// Currency utility functions for Kuwaiti Dinar (KWD)
export const CURRENCY_SYMBOL = 'د.ك' // Kuwaiti Dinar symbol
export const CURRENCY_CODE = 'KWD'

/**
 * Format a number as Kuwaiti Dinar currency
 * @param {number} amount - The amount to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    showCode = false,
    decimals = 3, // KWD typically shows 3 decimal places
    locale = 'en-KW'
  } = options

  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? `${CURRENCY_SYMBOL} 0.000` : '0.000'
  }

  const formattedAmount = Number(amount).toFixed(decimals)
  
  if (showCode) {
    return `${formattedAmount} ${CURRENCY_CODE}`
  }
  
  if (showSymbol) {
    return `${CURRENCY_SYMBOL} ${formattedAmount}`
  }
  
  return formattedAmount
}

/**
 * Format currency for display in tables and lists
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrencyCompact = (amount) => {
  return formatCurrency(amount, { decimals: 3 })
}

/**
 * Format currency for input fields (without symbol)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted amount without currency symbol
 */
export const formatCurrencyInput = (amount) => {
  return formatCurrency(amount, { showSymbol: false, decimals: 3 })
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0
  
  // Remove currency symbols and codes
  const cleaned = currencyString
    .replace(CURRENCY_SYMBOL, '')
    .replace(CURRENCY_CODE, '')
    .replace(/[^\d.-]/g, '')
    .trim()
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Validate currency amount
 * @param {number|string} amount - Amount to validate
 * @returns {boolean} True if valid currency amount
 */
export const isValidCurrency = (amount) => {
  const num = typeof amount === 'string' ? parseCurrency(amount) : Number(amount)
  return !isNaN(num) && num >= 0
}

/**
 * Get currency symbol for display
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => CURRENCY_SYMBOL

/**
 * Get currency code
 * @returns {string} Currency code
 */
export const getCurrencyCode = () => CURRENCY_CODE

export default {
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencyInput,
  parseCurrency,
  isValidCurrency,
  getCurrencySymbol,
  getCurrencyCode,
  CURRENCY_SYMBOL,
  CURRENCY_CODE
}
