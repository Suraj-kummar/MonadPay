import { motion } from 'framer-motion';
import { TrendingUp, Zap, Activity, Terminal } from 'lucide-react';
import { KPICard } from '../components/cards/KPICard';
import type { Agent, Transaction } from '../types';
import { VERIFIED_SERVICES, MAX_VISIBLE_TRANSACTIONS } from '../constants/mockData';

interface DashboardTabProps {
    totalVolume: number;
    agents: Agent[];
    transactions: Transaction[];
    realBalance?: string | null;
}

/**
 * Dashboard tab showing KPIs, system activity, and live ledger
 */
export function DashboardTab({ totalVolume, agents, transactions, realBalance }: DashboardTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-16"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <KPICard
                    title="Primary Balance"
                    value={realBalance ? `${parseFloat(realBalance).toFixed(4)} MON` : `${totalVolume.toLocaleString()} MON`}
                    change={realBalance ? "Live Web3" : "Simulated"}
                    icon={TrendingUp}
                    trend="up"
                    theme="indigo"
                />
                <KPICard
                    title="Network Nodes"
                    value={agents.filter(a => a.status === 'working').length.toString()}
                    change="Nominal"
                    icon={Zap}
                    trend="neutral"
                    theme="violet"
                />
                <KPICard
                    title="Parallelism"
                    value="98.2%"
                    change="Optimized"
                    icon={Activity}
                    trend="up"
                    theme="emerald"
                />
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#836EF1]/60 mb-1">Network Capacity</span>
                    <p className="text-3xl font-black text-white tracking-tighter">10k+ TPS</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <Activity className="w-3 h-3 text-[#00FF85]" />
                        <span className="text-[9px] font-bold text-[#00FF85] uppercase tracking-widest">Monad Core Active</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <h3 className="text-2xl font-black text-white flex items-center uppercase tracking-tighter">
                    <Terminal className="w-7 h-7 mr-4 text-indigo-500" />
                    System Activity
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 bg-white/[0.03] backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live Ledger</span>
                            <Activity className="w-4 h-4 text-indigo-500 animate-pulse" />
                        </div>
                        <div className="divide-y divide-white/5">
                            {transactions.slice(0, MAX_VISIBLE_TRANSACTIONS).map(tx => (
                                <div key={tx.id} className="p-8 hover:bg-white/[0.02] flex items-center justify-between transition-colors group">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Zap className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-white tracking-widest">{tx.amount} MON</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase mt-1">{tx.sender} • {tx.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-white tracking-tighter">{tx.amount.toFixed(2)} MON</p>
                                        <p className="text-[10px] font-black uppercase text-indigo-500/70 mt-1">{tx.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-[0_30px_60px_rgba(79,70,229,0.3)]">
                            <h4 className="text-3xl font-black tracking-tighter mb-4 leading-none">Smart Re-balancing</h4>
                            <p className="text-sm font-medium opacity-80 mb-8">AI Agents detected low congestion in 12 nodes. Optimization triggered.</p>
                            <button className="w-full bg-white text-indigo-600 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">View Decision Map</button>
                        </div>
                        <div className="bg-white/5 rounded-[40px] p-8 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-6">Service Health</span>
                            {VERIFIED_SERVICES.map(s => (
                                <div key={s.id} className="flex items-center justify-between mb-4 last:mb-0">
                                    <span className="text-xs font-bold text-white">{s.name}</span>
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">{s.trustScore}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
