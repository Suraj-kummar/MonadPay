# Custom Hooks Reference

## useWallet
Manages MetaMask connection via ethers.js v6.
- `connectWallet()` - requests accounts, fetches balance
- `disconnectWallet()` - clears local UI state
- Listens to `accountsChanged` and `chainChanged` events

## useRiskEngine
Calculates a live risk score from simulated gas + network load.
- Formula: `(gasPrice/100)*0.6 + (networkLoad/100)*0.4`
- Updates every `GAS_UPDATE_INTERVAL` ms
- Blocks payments when riskScore > 0.85

## useSimulation
Runs the AI agent autonomous payment simulation loop.
- Respects `riskScore` and `isJudgeMode`
- Generates micro-transactions between agents and services

## usePersistence
Wraps React state with localStorage read/write.
- Persists `agents[]` and `transactions[]` across page reloads
