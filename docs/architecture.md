# MonadPay Architecture

## Overview
MonadPay is a React + TypeScript SPA built with Vite.

## Layers
```
UI Layer (React components)
  +-- Tab components (Dashboard, Fleet, Ledger, Governance)
       +-- Shared components (Cards, Modals, Layout)
            +-- Custom Hooks (useWallet, useRiskEngine, useSimulation, usePersistence)
                 +-- Utilities (formatters, validators, cn)
                      +-- Constants (mockData, config)
```

## Data Flow
- All state lives in AgentPayDashboard_NEW.tsx
- Hooks manage async effects and localStorage
- Components are pure/presentational wherever possible
