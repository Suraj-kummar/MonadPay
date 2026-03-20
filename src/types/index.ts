/**
 * MonadPay - Core TypeScript Type Definitions
 * Agent, Transaction, Proposal, Toast interfaces
 */
// Type definitions for MonadPay

export type AgentStatus = 'working' | 'idle' | 'offline';

export interface Agent {
    id: string;
    name: string;
    type: string;
    balance: number;
    allowance: number;
    allowanceUsed: number;
    status: AgentStatus;
    currentThought?: string;
    riskAversion: number;
    specialization: 'Coordinator' | 'Compute' | 'Security' | 'Liquidity' | 'Data';
    successRate: number;
    gasSaved: number;
}

export interface Proposal {
    id: string;
    title: string;
    description: string;
    proposer: string;
    votesFor: number;
    votesAgainst: number;
    status: 'Active' | 'Passed' | 'Rejected';
    type: 'Security' | 'Optimization' | 'Expansion';
}

export interface Transaction {
    id: string;
    sender: string;
    recipient: string;
    amount: number;
    type: 'Compute' | 'Data' | 'Storage';
    status: 'Completed' | 'Pending' | 'Failed';
    timestamp: string;
    realTimestamp: number;
}

export interface VerifiedService {
    id: string;
    name: string;
    address: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    trustScore: number;
}

export interface ToastMessage {
    message: string;
    type: 'success' | 'error' | 'warning';
}

export interface WalletState {
    isConnected: boolean;
    address: string | null;
}

export type Theme = 'indigo' | 'violet' | 'emerald';

export interface ThemeColors {
    main: string;
    text: string;
    light: string;
}

