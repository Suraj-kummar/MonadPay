
# MonadPay - 24 incremental commits script
$ErrorActionPreference = "Stop"
$projectDir = "c:\Users\suraj\OneDrive\Desktop\monadpay\MonadPay"
Set-Location $projectDir

function Commit-And-Push {
    param($message)
    git add -A
    git commit -m $message
    git push origin main
    Write-Host "✅ Pushed: $message" -ForegroundColor Green
    Start-Sleep -Seconds 1
}

# ── COMMIT 1: README + screenshots
Commit-And-Push "docs: add comprehensive README with live screenshots"

# ── COMMIT 2: tweak index.html title & meta
(Get-Content index.html) -replace '<title>.*</title>', '<title>MonadPay — AI Payment Intelligence on Monad</title>' | Set-Content index.html
(Get-Content index.html) -replace '</head>', '  <meta name="description" content="MonadPay: autonomous AI-agent payment system on Monad blockchain" />`n  <meta name="keywords" content="monad, crypto, AI agents, payments, web3" />`n  </head>' | Set-Content index.html
Commit-And-Push "feat: update index.html with MonadPay title and SEO meta tags"

# ── COMMIT 3: add og image meta
(Get-Content index.html) -replace '</head>', '  <meta property="og:title" content="MonadPay" />`n  <meta property="og:description" content="AI-Powered Payment Intelligence on Monad" />`n  <meta property="og:type" content="website" />`n  </head>' | Set-Content index.html
Commit-And-Push "feat: add Open Graph meta tags to index.html"

# ── COMMIT 4: add .env.example
Set-Content ".env.example" "# MonadPay Environment Variables`nVITE_APP_NAME=MonadPay`nVITE_MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz`nVITE_ENABLE_MOCK_MODE=true"
Commit-And-Push "chore: add .env.example with environment variable documentation"

# ── COMMIT 5: add CONTRIBUTING.md
Set-Content "CONTRIBUTING.md" "# Contributing to MonadPay`n`nWe welcome contributions! Please follow these steps:`n`n1. Fork the repo`n2. Create a branch: \`git checkout -b feat/your-feature\``n3. Make changes and commit: \`git commit -m 'feat: description'\``n4. Push and open a PR against \`main\``n`n## Code Style`n- Use TypeScript strictly (no \`any\` unless necessary)`n- Follow existing component patterns`n- Use custom hooks for all business logic`n"
Commit-And-Push "docs: add CONTRIBUTING.md guide"

# ── COMMIT 6: add LICENSE
Set-Content "LICENSE" "MIT License`n`nCopyright (c) 2025 MonadPay Contributors`n`nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:`n`nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.`n`nTHE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND."
Commit-And-Push "chore: add MIT LICENSE file"

# ── COMMIT 7: add CHANGELOG.md
Set-Content "CHANGELOG.md" "# Changelog`n`n## [1.0.0] - 2025-03-20`n### Added`n- Initial MonadPay dashboard with 4 tabs`n- AI agent fleet management`n- Real-time risk engine`n- Web3 wallet integration via ethers.js`n- 3D Three.js animated background`n- On-chain governance voting`n- Payment modal with ENS support`n- LocalStorage persistence`n- Live market price feed (MON/ETH/SOL)`n- Toast notification system`n- Judge Mode toggle`n"
Commit-And-Push "docs: add CHANGELOG.md for v1.0.0"

# ── COMMIT 8: add .github/ISSUE_TEMPLATE
New-Item -ItemType Directory -Force ".github\ISSUE_TEMPLATE" | Out-Null
Set-Content ".github\ISSUE_TEMPLATE\bug_report.md" "---`nname: Bug Report`nlabels: bug`n---`n## Describe the Bug`n`n## Steps to Reproduce`n1.`n2.`n`n## Expected Behavior`n`n## Screenshots`n`n## Environment`n- Browser:`n- Node version:`n- OS:`n"
Commit-And-Push "chore: add GitHub issue template for bug reports"

# ── COMMIT 9: add feature request template
Set-Content ".github\ISSUE_TEMPLATE\feature_request.md" "---`nname: Feature Request`nlabels: enhancement`n---`n## Is your feature request related to a problem?`n`n## Describe the solution you'd like`n`n## Additional context`n"
Commit-And-Push "chore: add GitHub feature request issue template"

# ── COMMIT 10: add PR template
New-Item -ItemType Directory -Force ".github" | Out-Null
Set-Content ".github\pull_request_template.md" "## Summary`nBriefly describe the change.`n`n## Type of Change`n- [ ] Bug fix`n- [ ] New feature`n- [ ] Refactor`n- [ ] Docs`n`n## Testing`n- [ ] Tested locally`n- [ ] No regressions`n"
Commit-And-Push "chore: add GitHub pull request template"

# ── COMMIT 11: add .editorconfig
Set-Content ".editorconfig" "root = true`n`n[*]`nindent_style = space`nindent_size = 2`nend_of_line = lf`ncharset = utf-8`ntrim_trailing_whitespace = true`ninsert_final_newline = true`n`n[*.md]`ntrim_trailing_whitespace = false`n"
Commit-And-Push "chore: add .editorconfig for consistent code style"

# ── COMMIT 12: add .nvmrc
Set-Content ".nvmrc" "20"
Commit-And-Push "chore: add .nvmrc to pin Node.js version to 20"

# ── COMMIT 13: add vercel.json for deployment
Set-Content "vercel.json" '{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}'
Commit-And-Push "feat: add vercel.json for one-click Vercel deployment"

# ── COMMIT 14: add src/constants/config.ts
New-Item -ItemType Directory -Force "src\constants" | Out-Null
Set-Content "src\constants\config.ts" "/**
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
"
Commit-And-Push "refactor: extract app-level constants into src/constants/config.ts"

# ── COMMIT 15: add src/utils/formatters.ts
Set-Content "src\utils\formatters.ts" "/**
 * Utility functions for formatting data in the MonadPay UI
 */

/** Format a MON amount to 4 decimal places */
export function formatMON(amount: number): string {
  return \`\${amount.toFixed(4)} MON\`;
}

/** Truncate an Ethereum address for display (0x1234...abcd) */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return \`\${address.slice(0, chars + 2)}...\${address.slice(-chars)}\`;
}

/** Format a large number with commas (e.g., 1250442 -> '1,250,442') */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Format a risk score (0-1) as a percentage string */
export function formatRisk(score: number): string {
  return \`\${(score * 100).toFixed(1)}%\`;
}
"
Commit-And-Push "feat: add src/utils/formatters.ts with MON, address, risk formatters"

# ── COMMIT 16: add src/utils/validators.ts
Set-Content "src\utils\validators.ts" "/**
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
"
Commit-And-Push "feat: add src/utils/validators.ts for address and amount validation"

# ── COMMIT 17: add src/types/index.ts documentation comments
$typesPath = "src\types"
if (Test-Path "$typesPath\index.ts") {
    $content = Get-Content "$typesPath\index.ts" -Raw
    if (-not $content.StartsWith("/**")) {
        Set-Content "$typesPath\index.ts" "/**`n * MonadPay - Core TypeScript Type Definitions`n * Agent, Transaction, Proposal, Toast interfaces`n */`n$content"
    }
}
Commit-And-Push "docs: add JSDoc header to types/index.ts"

# ── COMMIT 18: add docs/ folder with architecture.md
New-Item -ItemType Directory -Force "docs" | Out-Null
Set-Content "docs\architecture.md" "# MonadPay Architecture`n`n## Overview`nMonadPay is a React + TypeScript SPA built with Vite.`n`n## Layers`n\`\`\`\`\nUI Layer (React components)`n  └── Tab components (Dashboard, Fleet, Ledger, Governance)`n       └── Shared components (Cards, Modals, Layout)`n            └── Custom Hooks (useWallet, useRiskEngine, useSimulation, usePersistence)`n                 └── Utilities (formatters, validators, cn)`n                      └── Constants (mockData, config)`n\`\`\`\``n`n## Data Flow`n- All state lives in AgentPayDashboard_NEW.tsx`n- Hooks manage async effects and localStorage`n- Components are pure/presentational wherever possible`n"
Commit-And-Push "docs: add docs/architecture.md explaining app structure and data flow"

# ── COMMIT 19: add docs/hooks.md
Set-Content "docs\hooks.md" "# Custom Hooks Reference`n`n## useWallet`nManages MetaMask connection via ethers.js v6.`n- \`connectWallet()\` - requests accounts, fetches balance`n- \`disconnectWallet()\` - clears local UI state`n- Listens to \`accountsChanged\` and \`chainChanged\` events`n`n## useRiskEngine`nCalculates a live risk score from simulated gas + network load.`n- Formula: \`(gasPrice/100)*0.6 + (networkLoad/100)*0.4\``n- Updates every \`GAS_UPDATE_INTERVAL\` ms`n`n## useSimulation`nRuns the AI agent autonomous payment simulation loop.`n- Respects \`riskScore\` and \`isJudgeMode\``n`n## usePersistence`nWraps React state with localStorage read/write.`n- Persists \`agents[]\` and \`transactions[]\` across page reloads`n"
Commit-And-Push "docs: add docs/hooks.md reference guide for all custom hooks"

# ── COMMIT 20: add docs/deployment.md
Set-Content "docs\deployment.md" "# Deployment Guide`n`n## Vercel (Recommended)`n1. Connect your GitHub repo to Vercel`n2. Set \`Build Command\`: \`npm run build\``n3. Set \`Output Directory\`: \`dist\``n4. Deploy!`n`nVercel config is already included in \`vercel.json\`.`n`n## Manual / Static Host`n\`\`\`bash`nnpm run build`n# Upload the dist/ folder to any static host (Netlify, GitHub Pages, etc)`n\`\`\``n`n## Environment Variables`nCopy \`.env.example\` to \`.env\` and fill in your values before building.`n"
Commit-And-Push "docs: add docs/deployment.md for Vercel and static hosting"

# ── COMMIT 21: add .github/workflows/ci.yml
New-Item -ItemType Directory -Force ".github\workflows" | Out-Null
Set-Content ".github\workflows\ci.yml" "name: CI`n`non:`n  push:`n    branches: [main]`n  pull_request:`n    branches: [main]`n`njobs:`n  build:`n    runs-on: ubuntu-latest`n    steps:`n      - uses: actions/checkout@v4`n      - uses: actions/setup-node@v4`n        with:`n          node-version: '20'`n          cache: 'npm'`n      - run: npm ci`n      - run: npm run lint`n      - run: npm run build`n"
Commit-And-Push "ci: add GitHub Actions CI workflow for lint and build checks"

# ── COMMIT 22: improve vite.config.ts
Set-Content "vite.config.ts" "import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
"
Commit-And-Push "perf: improve vite.config.ts with path alias and manual chunk splitting"

# ── COMMIT 23: add src/utils/constants.ts re-export
Set-Content "src\utils\index.ts" "// Barrel export for all utilities
export { cn } from './cn';
export { formatMON, truncateAddress, formatNumber, formatRisk } from './formatters';
export { isValidEthAddress, isENSName, isValidAmount } from './validators';
"
Commit-And-Push "refactor: add src/utils/index.ts barrel export for all utilities"

# ── COMMIT 24: final polish — update package.json description + version
$pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
$pkg.description = "AI-Powered Payment Intelligence on the Monad Blockchain"
$pkg.version = "1.0.0"
$pkg.author = "Suraj Kumar"
$pkg.homepage = "https://github.com/Suraj-kummar/MonadPay"
$pkg.repository = @{ type = "git"; url = "https://github.com/Suraj-kummar/MonadPay.git" }
$pkg | ConvertTo-Json -Depth 10 | Set-Content "package.json"
Commit-And-Push "chore: finalize package.json with description, version, author, and repo URL"

Write-Host "`n🎉 All 24 commits pushed to https://github.com/Suraj-kummar/MonadPay.git" -ForegroundColor Cyan
