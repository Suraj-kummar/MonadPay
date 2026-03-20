import { motion } from 'framer-motion';
import { Terminal, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ParallaxCard } from './ParallaxCard';
import type { Agent } from '../../types';

interface AgentIntelligenceCardProps {
    agent: Agent;
    riskScore: number;
    onClick: () => void;
}

/**
 * Agent card displaying intelligence metrics and status
 */
export function AgentIntelligenceCard({ agent, riskScore, onClick }: AgentIntelligenceCardProps) {
    const isPaused = riskScore > 0.8 && agent.riskAversion > 0.2;

    return (
        <ParallaxCard>
            <div
                onClick={onClick}
                className={cn(
                    "bg-white/[0.03] backdrop-blur-3xl rounded-[50px] border border-white/10 p-10 transition-all duration-700 cursor-pointer group",
                    isPaused ? "border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.1)]" : "hover:border-indigo-500/30"
                )}
            >
                <div className="flex justify-between items-start mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h4 className="text-3xl font-black text-white tracking-tighter">{agent.name}</h4>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">{agent.type} • {agent.specialization}</p>
                    </div>
                    <div className={cn(
                        "px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                        isPaused ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                    )}>
                        {isPaused ? "Paused" : agent.status}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-white/5 rounded-3xl p-6">
                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">Liquidity</span>
                        <p className="text-2xl font-black text-indigo-300 leading-none tracking-tighter">{agent.balance.toLocaleString()} MON</p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6">
                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">Trust</span>
                        <p className="text-xl font-black text-emerald-400 leading-none tracking-tighter">{agent.successRate}%</p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6">
                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">Limit</span>
                        <div className="flex items-center space-x-2">
                            <p className="text-xl font-black text-white leading-none tracking-tighter">{agent.allowance} MON</p>
                            <ShieldAlert className="w-3 h-3 text-slate-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-black uppercase text-slate-500">Neural Efficiency</span>
                        <span className="text-xs font-black text-white">{(agent.allowanceUsed / agent.allowance * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${(agent.allowanceUsed / agent.allowance * 100)}%` }} className="h-full bg-white shadow-[0_0_20px_white]" />
                    </div>
                </div>

                <div className="mt-10 p-6 bg-black/40 rounded-3xl border border-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <Terminal className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thought Log</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 font-mono leading-relaxed h-8 overflow-hidden">
                        {agent.currentThought}
                    </p>
                </div>
            </div>
        </ParallaxCard>
    );
}
