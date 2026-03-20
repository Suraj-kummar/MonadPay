/**
 * Application-level configuration constants
 */
export const APP_CONFIG = {
  name: 'MonadPay',
  version: '1.0.0',
  description: 'AI-Powered Payment Intelligence on Monad',
  monadTestnetChainId: 41454,
  monadMainnetChainId: 41455,
  defaultNetwork: 'Monad Testnet',
  currency: 'MON',
  maxRiskThreshold: 0.85,
  toastDuration: 3000,
  priceUpdateInterval: 5000,
  gasUpdateInterval: 4000,
} as const;

