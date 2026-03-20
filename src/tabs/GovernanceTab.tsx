import { motion } from 'framer-motion';
import { Activity, ZapOff } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Proposal } from '../types';

interface GovernanceTabProps {
    proposals: Proposal[];
    onVote: (proposalId: string, side: 'for' | 'against') => void;
}

/**
 * Governance tab showing proposals and voting interface
 */
export function GovernanceTab({ proposals, onVote }: GovernanceTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-10"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Neural Governance</h3>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Autonomous Fleet Proposals</p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-3xl backdrop-blur-xl">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block mb-1">Total Power</span>
                    <span className="text-2xl font-black text-white tracking-tighter">1,250,442 NV</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {proposals.map(proposal => (
                    <div key={proposal.id} className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] border border-white/10 p-10 hover:border-indigo-500/30 transition-all">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        proposal.type === 'Security' ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    )}>
                                        {proposal.type}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 uppercase">{proposal.proposer}</span>
                                </div>
                                <h4 className="text-3xl font-black text-white tracking-tighter">{proposal.title}</h4>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">{proposal.status}</span>
                            </div>
                        </div>

                        <p className="text-slate-400 font-medium mb-10 leading-relaxed max-w-2xl">{proposal.description}</p>

                        <div className="flex items-center space-x-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-emerald-400">{proposal.votesFor.toLocaleString()} Yes</span>
                                    <span className="text-rose-400">{proposal.votesAgainst.toLocaleString()} No</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                                    <motion.div
                                        animate={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst) * 100)}%` }}
                                        className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => onVote(proposal.id, 'for')}
                                    className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                    aria-label="Vote for proposal"
                                >
                                    <Activity className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onVote(proposal.id, 'against')}
                                    className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all"
                                    aria-label="Vote against proposal"
                                >
                                    <ZapOff className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
