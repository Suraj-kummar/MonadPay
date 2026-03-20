import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, ZapOff } from 'lucide-react';
import { SceneBackground } from './components/3d/SceneBackground';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PaymentModal } from './components/modals/PaymentModal';
import { DashboardTab } from './tabs/DashboardTab';
import { AgentsTab } from './tabs/AgentsTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { GovernanceTab } from './tabs/GovernanceTab';
import { useWallet } from './hooks/useWallet';
import { usePersistence } from './hooks/usePersistence';
import { useRiskEngine } from './hooks/useRiskEngine';
import { useSimulation } from './hooks/useSimulation';
import type { ToastMessage, Proposal } from './types';
import { INITIAL_AGENTS, INITIAL_PROPOSALS, INITIAL_TRANSACTIONS, PRICE_UPDATE_INTERVAL } from './constants/mockData';
import { cn } from './utils/cn';

/**
 * Main AgentPay Dashboard Component
 * Refactored from 1067 lines to ~200 lines
 */
export default function AgentPayDashboard() {
    // Tab state
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);

    // Custom hooks
    const { isWalletConnected, userAddress, balance, connectWallet, disconnectWallet } = useWallet();
    const { agents, setAgents, transactions, setTransactions } = usePersistence();
    const { gasPrice, networkLoad, riskScore, isGasLoading } = useRiskEngine();

    // State declarations
    const [selectedAgentId, setSelectedAgentId] = useState<string>('');
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
    const [prices, setPrices] = useState({ mon: 3.45, eth: 2500, sol: 140 });
    const [isJudgeMode, setIsJudgeMode] = useState(false);
    const [isPriceLoading, setIsPriceLoading] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('Monad Testnet');

    // Initialize data if empty
    useEffect(() => {
        if (agents.length === 0) setAgents(INITIAL_AGENTS);
        if (transactions.length === 0) setTransactions(INITIAL_TRANSACTIONS);
    }, [agents.length, transactions.length, setAgents, setTransactions]);

    // Sync selectedAgentId when agents are loaded
    useEffect(() => {
        if (!selectedAgentId && agents.length > 0) {
            setSelectedAgentId(agents[0].id);
        }
    }, [agents, selectedAgentId]);

    // Calculated values
    const totalVolume = useMemo(() => transactions.reduce((acc, tx) => acc + tx.amount, 0), [transactions]);
    const activityLevel = useMemo(() => transactions.length / 50, [transactions.length]);

    // Simulation hook
    useSimulation({ agents, setAgents, setTransactions, riskScore, isJudgeMode });

    // Price updates - cleaner polling without async
    useEffect(() => {
        const fetchPrices = () => {
            setIsPriceLoading(true);
            setPrices(prev => ({
                mon: Math.max(0.1, prev.mon + (Math.random() - 0.5) * 0.1),
                eth: Math.max(1000, prev.eth + (Math.random() - 0.5) * 50),
                sol: prev.sol
            }));
            setIsPriceLoading(false);
        };

        const interval = setInterval(fetchPrices, PRICE_UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // Toast auto-dismiss
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Memoized Handlers - prevents unnecessary re-renders
    const handleVote = useCallback((proposalId: string, side: 'for' | 'against') => {
        setProposals(prev => prev.map(p => p.id === proposalId ? {
            ...p,
            votesFor: side === 'for' ? p.votesFor + 100 : p.votesFor,
            votesAgainst: side === 'against' ? p.votesAgainst + 100 : p.votesAgainst
        } : p));
        setToast({ message: "Governance Vote Cast (100 Weight)", type: "success" });
    }, []);

    const handlePay = useCallback((agentId: string, recipient: string, amount: number, resolvedAddress: string | null): ToastMessage => {
        // Use functional update to avoid stale closures
        let result: ToastMessage = { message: 'Processing...', type: 'success' };

        setAgents(prevAgents => {
            const agent = prevAgents.find(a => a.id === agentId);
            const finalRecipient = resolvedAddress || recipient;

            if (!agent) {
                result = { message: 'Agent not found', type: 'error' };
                return prevAgents;
            }

            // Risk Intelligence
            if (riskScore > 0.85 && agent.riskAversion > 0.1) {
                result = { message: 'Agent refused: Network risk threshold exceeded.', type: 'warning' };
                return prevAgents;
            }

            if (isNaN(amount) || amount <= 0) {
                result = { message: 'Invalid amount', type: 'error' };
                return prevAgents;
            }

            if (agent.balance < amount) {
                result = { message: 'Insufficient balance', type: 'error' };
                return prevAgents;
            }

            // Create transaction with unique ID
            const newTx = {
                id: `tx-${crypto.randomUUID()}`,
                sender: agent.name,
                recipient: finalRecipient,
                amount,
                type: 'Compute' as const,
                status: 'Completed' as const,
                timestamp: 'Just now',
                realTimestamp: Date.now()
            };

            setTransactions(prevTx => [newTx, ...prevTx]);
            result = { message: `Securely routed to ${finalRecipient}`, type: 'success' };

            return prevAgents.map(a => a.id === agentId ?
                { ...a, balance: a.balance - amount, allowanceUsed: a.allowanceUsed + amount } : a
            );
        });

        setToast(result);
        return result;
    }, [riskScore, setAgents, setTransactions]);

    const handleWalletConnect = async () => {
        const result = await connectWallet();
        setToast(result);
    };

    const handleWalletDisconnect = () => {
        const result = disconnectWallet();
        setToast(result);
    };

    return (
        <div className="relative h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/50 overflow-hidden cursor-default">
            {/* Premium 3D Layer */}
            <div className="fixed inset-0 z-0">
                <SceneBackground activityLevel={activityLevel} riskLevel={riskScore} />
            </div>

            {/* Cinematic Noise Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            <div className="fixed inset-0 z-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex h-full">
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    prices={prices}
                    isPriceLoading={isPriceLoading}
                    isJudgeMode={isJudgeMode}
                    setIsJudgeMode={setIsJudgeMode}
                    isWalletConnected={isWalletConnected}
                    userAddress={userAddress}
                    connectWallet={handleWalletConnect}
                    disconnectWallet={handleWalletDisconnect}
                    gasPrice={gasPrice}
                    networkLoad={networkLoad}
                    riskScore={riskScore}
                    isGasLoading={isGasLoading}
                    selectedNetwork={selectedNetwork}
                    setSelectedNetwork={setSelectedNetwork}
                />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <Header activeTab={activeTab} onOpenModal={() => setShowModal(true)} />

                    <AnimatePresence mode='wait'>
                        {activeTab === 'dashboard' && (
                            <DashboardTab
                                key="dashboard"
                                totalVolume={totalVolume}
                                agents={agents}
                                transactions={transactions}
                                realBalance={balance}
                            />
                        )}

                        {activeTab === 'agents' && (
                            <AgentsTab
                                key="agents"
                                agents={agents}
                                riskScore={riskScore}
                                onSelectAgent={setSelectedAgentId}
                            />
                        )}

                        {activeTab === 'transactions' && (
                            <TransactionsTab
                                key="transactions"
                                transactions={transactions}
                            />
                        )}

                        {activeTab === 'governance' && (
                            <GovernanceTab
                                key="governance"
                                proposals={proposals}
                                onVote={handleVote}
                            />
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                show={showModal}
                onClose={() => setShowModal(false)}
                agents={agents}
                selectedAgentId={selectedAgentId}
                setSelectedAgentId={setSelectedAgentId}
                riskScore={riskScore}
                onPay={handlePay}
            />

            {/* Dynamic Toasts */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className={cn(
                            "fixed top-12 right-12 p-8 rounded-[30px] shadow-2xl border flex items-center space-x-6 backdrop-blur-3xl z-[200]",
                            toast.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                toast.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        )}
                        role="alert"
                        aria-live="polite"
                    >
                        {toast.type === 'warning' ? <ZapOff className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                        <div>
                            <p className="font-black uppercase tracking-widest text-xs mb-1">{toast.type}</p>
                            <p className="font-bold text-lg leading-tight">{toast.message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
