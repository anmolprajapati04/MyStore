/**
 * Formats a number as Indian Rupee (INR) currency.
 * Example: 150000 -> ₹1,50,000
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a number as INR without the symbol if needed.
 */
export const formatNumberIN = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}
