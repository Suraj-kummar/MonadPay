/**
 * Input validation utilities for MonadPay payment flows
 */

/** Check if a string is a valid Ethereum address */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/** Check if a string looks like an ENS name */
export function isENSName(input: string): boolean {
  return input.endsWith('.eth') || input.endsWith('.xyz');
}

/** Validate payment amount */
export function isValidAmount(amount: string): boolean {
  const n = parseFloat(amount);
  return !isNaN(n) && n > 0 && n < 1_000_000;
}

