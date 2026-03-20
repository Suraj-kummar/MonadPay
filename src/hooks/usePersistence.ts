import { useState, useEffect } from 'react';
import type { Agent, Transaction } from '../types';

/**
 * Custom hook for persisting non-sensitive data to localStorage
 * Includes error handling for corrupted data
 */
export function usePersistence() {
    const [agents, setAgents] = useState<Agent[]>(() => {
        try {
            const saved = localStorage.getItem('agentpay_agents');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load agents from localStorage:', error);
            return [];
        }
    });

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        try {
            const saved = localStorage.getItem('agentpay_transactions');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load transactions from localStorage:', error);
            return [];
        }
    });

    // Persist agents to localStorage
    useEffect(() => {
        try {
            if (agents.length > 0) {
                localStorage.setItem('agentpay_agents', JSON.stringify(agents));
            }
        } catch (error) {
            console.error('Failed to save agents to localStorage:', error);
        }
    }, [agents]);

    // Persist transactions to localStorage
    useEffect(() => {
        try {
            if (transactions.length > 0) {
                localStorage.setItem('agentpay_transactions', JSON.stringify(transactions));
            }
        } catch (error) {
            console.error('Failed to save transactions to localStorage:', error);
        }
    }, [transactions]);

    return {
        agents,
        setAgents,
        transactions,
        setTransactions
    };
}
