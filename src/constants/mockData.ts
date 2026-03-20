import { Cpu, Database, Globe, Lightbulb } from 'lucide-react';
import type { Agent, Proposal, Transaction, VerifiedService, ThemeColors } from '../types';

// Constants
export const MAX_VISIBLE_TRANSACTIONS = 8;
export const PRICE_VOLATILITY_FACTOR = 0.1;
export const GAS_UPDATE_INTERVAL = 5000;
export const AGENT_UPDATE_INTERVAL = 4000;
export const PRICE_UPDATE_INTERVAL = 15000;
export const MAX_TRANSACTION_HISTORY = 30;

// Verified Services
export const VERIFIED_SERVICES: VerifiedService[] = [
    { id: 'vs1', name: 'Monad Compute Protocol', address: '0xMON...COMP', icon: Cpu, category: 'Infrastructure', trustScore: 99.9 },
    { id: 'vs2', name: 'Moltiverse Data Store', address: '0xMON...DATA', icon: Database, category: 'Storage', trustScore: 98.5 },
    { id: 'vs3', name: 'Pyth Network Oracle', address: '0xPYTH...MON', icon: Globe, category: 'Data', trustScore: 99.2 },
    { id: 'vs4', name: 'Monad API Nexus', address: '0xMON...API', icon: Lightbulb, category: 'AI Services', trustScore: 97.8 },
];

// Agent Thoughts
export const AGENT_THOUGHTS = [
    "Analyzing gas price trends...",
    "Optimizing batch execution...",
    "Verifying recipient reputation...",
    "Syncing with mesh network...",
    "Risk Engine: Monitoring network load.",
    "Negotiating compute rates...",
    "Rebalancing liquidity pools..."
];

// Initial Agents
export const INITIAL_AGENTS: Agent[] = [
    {
        id: 'a1',
        name: 'Nexus_Orchestrator',
        type: 'Coordinator',
        balance: 12450.00,
        allowance: 5000,
        allowanceUsed: 1230.50,
        status: 'working',
        currentThought: "Coordinating swarm tasks...",
        riskAversion: 0.3,
        specialization: 'Coordinator',
        successRate: 99.8,
        gasSaved: 124.50
    },
    {
        id: 'a2',
        name: 'Render_Swarm_01',
        type: 'Compute Node',
        balance: 5250.75,
        allowance: 2500,
        allowanceUsed: 1490.00,
        status: 'idle',
        currentThought: "Cooling down circuits.",
        riskAversion: 0.8,
        specialization: 'Compute',
        successRate: 96.5,
        gasSaved: 45.20
    },
    {
        id: 'a3',
        name: 'Data_Harvester_X',
        type: 'Scraper',
        balance: 2890.20,
        allowance: 1000,
        allowanceUsed: 45.00,
        status: 'working',
        currentThought: "Scraping dark web nodes...",
        riskAversion: 0.5,
        specialization: 'Data',
        successRate: 98.2,
        gasSaved: 12.80
    },
    {
        id: 'a4',
        name: 'Sentinel_Prime',
        type: 'Security',
        balance: 8200.00,
        allowance: 2000,
        allowanceUsed: 0.00,
        status: 'idle',
        currentThought: "Monitoring firewall logs.",
        riskAversion: 0.1,
        specialization: 'Security',
        successRate: 100.0,
        gasSaved: 0.00
    },
];

// Initial Proposals
export const INITIAL_PROPOSALS: Proposal[] = [
    {
        id: 'p1',
        title: 'Expand Compute Swarm',
        description: 'Authorize creation of 5 new compute sub-nodes for higher parallel processing.',
        proposer: 'Nexus_Orchestrator',
        votesFor: 1240,
        votesAgainst: 120,
        status: 'Active',
        type: 'Expansion'
    },
    {
        id: 'p2',
        title: 'Hardened Firewall Patch',
        description: 'Emergency security patch for Sentinel Prime to detect zero-day exploits.',
        proposer: 'Sentinel_Prime',
        votesFor: 4500,
        votesAgainst: 0,
        status: 'Active',
        type: 'Security'
    },
];

// Initial Transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx1',
        sender: 'Nexus_Orchestrator',
        recipient: 'Render_Swarm_01',
        amount: 120.50,
        type: 'Compute',
        status: 'Completed',
        timestamp: '2 mins ago',
        realTimestamp: Date.now() - 120000
    },
    {
        id: 'tx2',
        sender: 'Data_Harvester_X',
        recipient: 'External_API',
        amount: 15.00,
        type: 'Data',
        status: 'Completed',
        timestamp: '15 mins ago',
        realTimestamp: Date.now() - 900000
    },
];

// Theme Colors
export const THEMES: Record<string, ThemeColors> = {
    indigo: { main: "bg-[#836EF1]", text: "text-[#836EF1]", light: "bg-[#836EF1]/10" },
    violet: { main: "bg-[#A0055D]", text: "text-[#A0055D]", light: "bg-[#A0055D]/10" },
    emerald: { main: "bg-[#00FF85]", text: "text-[#00FF85]", light: "bg-[#00FF85]/10" },
};
