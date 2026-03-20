/**
 * Utility functions for formatting data in the MonadPay UI
 */

/** Format a MON amount to 4 decimal places */
export function formatMON(amount: number): string {
  return \\ MON\;
}

/** Truncate an Ethereum address for display (0x1234...abcd) */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return \\...\\;
}

/** Format a large number with commas (e.g., 1250442 -> '1,250,442') */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Format a risk score (0-1) as a percentage string */
export function formatRisk(score: number): string {
  return \\%\;
}

