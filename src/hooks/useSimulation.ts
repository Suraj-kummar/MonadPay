import { useEffect, useRef } from 'react';
import { BrowserProvider } from 'ethers';
import type { Agent, Transaction } from '../types';

interface SimulationProps {
    agents: Agent[];
    setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    riskScore: number;
    isJudgeMode: boolean;
}

/**
 * Simulates active network behavior using real Web3 blocks
 */
export function useSimulation({ agents, setAgents, setTransactions, riskScore, isJudgeMode }: SimulationProps) {
    const isMockRef = useRef(true);

    useEffect(() => {
        if (isJudgeMode || agents.length === 0) return;

        let provider: BrowserProvider | null = null;
        let blockListener: ((blockNumber: number) => void) | null = null;
        let mockInterval: ReturnType<typeof setInterval> | null = null;

        const handleBlock = async (blockNumber: number) => {
            // "Agent" behavior happens per new Web3 Block instead of pure wall-clock
            const availableAgents = agents.filter(a => a.balance > 10 && a.status === 'idle');
            if (availableAgents.length === 0) return;

            // Pick a random agent to do work this block
            const agent = availableAgents[Math.floor(Math.random() * availableAgents.length)];

            // If risk is high, agents conserve gas
            if (riskScore > 0.8 && agent.riskAversion > 0.3) return;

            const amount = Number((Math.random() * (agent.balance * 0.05)).toFixed(2));
            if (amount < 0.01) return;

            const type = agent.specialization;
            const newTx: Transaction = {
                id: `bk-${blockNumber}-${crypto.randomUUID().slice(0, 4)}`,
                sender: agent.name,
                recipient: ['0xMON...DATA', '0xPYTH...MON', '0xMON...API'][Math.floor(Math.random() * 3)],
                amount,
                type: type as any,
                status: 'Completed',
                timestamp: 'Just now',
                realTimestamp: Date.now()
            };

            setTransactions(prev => {
                const updated = [newTx, ...prev];
                return updated.slice(0, 30);
            });

            setAgents(prev => prev.map(a => {
                if (a.id === agent.id) {
                    return {
                        ...a,
                        balance: a.balance - amount,
                        status: 'working',
                        currentThought: `Processing block #${blockNumber}...`
                    };
                }
                // Randomly set others to idle
                if (a.status === 'working' && Math.random() > 0.7) {
                    return { ...a, status: 'idle', currentThought: 'Waiting for triggers...' };
                }
                return a;
            }));
        };

        const setupEthers = async () => {
            if (window.ethereum) {
                try {
                    provider = new BrowserProvider(window.ethereum);
                    // Test if we can actually reach the network 
                    await provider.getNetwork();
                    isMockRef.current = false;

                    blockListener = (blockNum) => handleBlock(blockNum);
                    provider.on("block", blockListener);
                    return;
                } catch (e) {
                    console.log("Web3 Provider exists but connection failed, falling back to mock driver");
                }
            }

            // Fallback Mock Driver (Local pure random interval)
            isMockRef.current = true;
            let mockBlock = 10000;
            mockInterval = setInterval(() => {
                mockBlock++;
                handleBlock(mockBlock);
            }, 4000);
        };

        setupEthers();

        return () => {
            if (provider && blockListener) {
                provider.off("block", blockListener);
            }
            if (mockInterval) {
                clearInterval(mockInterval);
            }
        };
    }, [agents, isJudgeMode, riskScore, setAgents, setTransactions]);

    // Judge Mode presentation engine
    useEffect(() => {
        if (!isJudgeMode) return;

        const interval = setInterval(() => {
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            const randomService = { name: ['0xMON...DATA', '0xPYTH...MON', '0xMON...API'][Math.floor(Math.random() * 3)] };
            const amt = Math.floor(Math.random() * 50) + 10;

            const newTx: Transaction = {
                id: `tx-jdg-${Date.now()}`,
                sender: randomAgent.name,
                recipient: randomService.name,
                amount: amt,
                type: 'Compute',
                status: 'Completed',
                timestamp: 'Just now',
                realTimestamp: Date.now()
            };

            setTransactions(prev => [newTx, ...prev].slice(0, 30));
        }, 15000);

        return () => clearInterval(interval);
    }, [isJudgeMode, agents, setTransactions]);
}
