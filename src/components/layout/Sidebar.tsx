import { LayoutDashboard, Users, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SidebarButton } from './SidebarButton';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    prices: { mon: number; eth: number; sol: number };
    isPriceLoading: boolean;
    isJudgeMode: boolean;
    setIsJudgeMode: (mode: boolean) => void;
    isWalletConnected: boolean;
    userAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    gasPrice: number;
    networkLoad: number;
    riskScore: number;
    isGasLoading: boolean;
    selectedNetwork: string;
    setSelectedNetwork: (network: string) => void;
}

/**
 * Main sidebar with navigation, market feed, and risk engine
 */
export function Sidebar({
    activeTab,
    setActiveTab,
    prices,
    isPriceLoading,
    isJudgeMode,
    setIsJudgeMode,
    isWalletConnected,
    userAddress,
    connectWallet,
    disconnectWallet,
    gasPrice,
    networkLoad,
    riskScore,
    isGasLoading,
    selectedNetwork,
    setSelectedNetwork
}: SidebarProps) {
    return (
        <aside className="w-80 bg-slate-950/20 backdrop-blur-3xl border-r border-white/10 flex flex-col hidden lg:flex">
            <div className="p-8">
                <div className="flex items-center space-x-4 mb-12">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 21V5.8C4 4.7 4.9 3.8 6 3.8H8.8L12 11.2L15.2 3.8H18C19.1 3.8 20 4.7 20 5.8V21M12 11.2V21" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter">MonadPay</h1>
                        <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase opacity-70">Intelligence Layer</span>
                    </div>
                </div>

                <nav className="space-y-3" role="navigation" aria-label="Main navigation">
                    <SidebarButton icon={LayoutDashboard} label="Command" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarButton icon={Users} label="Fleet" active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} />
                    <SidebarButton icon={ArrowRightLeft} label="Neural Ledger" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
                    <SidebarButton icon={ShieldCheck} label="Governance" active={activeTab === 'governance'} onClick={() => setActiveTab('governance')} />
                </nav>

                <div className="space-y-4">
                    <div className="bg-[#836EF1]/10 rounded-3xl p-6 border border-[#836EF1]/20">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Feed</span>
                                {isPriceLoading && <div className="w-1 h-1 rounded-full bg-[#836EF1] animate-ping" />}
                            </div>
                            <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-white tracking-widest">MON</span>
                                <span className="text-xs font-black text-[#00FF85]">${prices.mon.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center opacity-50">
                                <span className="text-[10px] font-bold text-slate-400">ETH</span>
                                <span className="text-[10px] font-black text-white">${prices.eth.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsJudgeMode(!isJudgeMode)}
                        className={cn(
                            "w-full py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all",
                            isJudgeMode ? "bg-[#A0055D] text-white shadow-[0_0_30px_rgba(160,5,93,0.4)]" : "bg-white/5 text-slate-500 hover:bg-white/10"
                        )}
                        aria-label={isJudgeMode ? "Disable judge mode" : "Enable judge mode"}
                    >
                        {isJudgeMode ? "Judging Active" : "Judge Mode"}
                    </button>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
                    <button
                        onClick={isWalletConnected ? disconnectWallet : connectWallet}
                        className={cn(
                            "w-full flex items-center justify-between px-6 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all",
                            isWalletConnected
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95"
                        )}
                        aria-label={isWalletConnected ? "Disconnect wallet" : "Connect wallet"}
                    >
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                            <span>{isWalletConnected ? "Connected" : "Link Wallet"}</span>
                        </div>
                        {isWalletConnected && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                    </button>

                    {isWalletConnected && (
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Address</p>
                            <p className="font-mono text-xs text-indigo-300 truncate">{userAddress}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto p-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Risk Engine</span>
                        <div className="flex items-center space-x-2">
                            {isGasLoading && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                riskScore > 0.7 ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            )}>
                                {riskScore > 0.7 ? 'High Alert' : 'Stable'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                            <span>Preferred Chain</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['Monad Testnet', 'Base', 'Solana'].map(net => (
                                <button
                                    key={net}
                                    onClick={() => setSelectedNetwork(net)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        selectedNetwork === net ? "bg-white text-black" : "text-slate-500 hover:text-white"
                                    )}
                                    aria-label={`Select ${net} network`}
                                    aria-pressed={selectedNetwork === net}
                                >
                                    {net}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Current Risk</span>
                                <span>{(riskScore * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    style={{ width: `${riskScore * 100}%` }}
                                    className={cn("h-full transition-all", riskScore > 0.7 ? "bg-rose-500" : "bg-indigo-500")}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-500">Gas</span>
                                <span className={cn("text-white font-black transition-opacity", isGasLoading ? "opacity-50" : "opacity-100")}>{gasPrice.toFixed(0)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-500">Load</span>
                                <span className="text-white font-black text-right">{networkLoad.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
