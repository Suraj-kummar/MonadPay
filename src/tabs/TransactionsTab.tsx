import { motion } from 'framer-motion';
import { ArrowRightLeft, Zap } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionsTabProps {
    transactions: Transaction[];
}

/**
 * Transactions tab showing full neural ledger
 */
export function TransactionsTab({ transactions }: TransactionsTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden"
        >
            <div className="p-10 border-b border-white/10 bg-white/[0.02]">
                <h3 className="text-3xl font-black text-white flex items-center uppercase tracking-tighter">
                    <ArrowRightLeft className="w-8 h-8 mr-4 text-indigo-500" />
                    Full Neural Ledger
                </h3>
            </div>
            <div className="divide-y divide-white/5 max-h-[70vh] overflow-y-auto">
                {transactions.map(tx => (
                    <div key={tx.id} className="p-10 hover:bg-white/[0.02] flex items-center justify-between transition-colors group">
                        <div className="flex items-center space-x-8">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white tracking-tight">{tx.recipient}</p>
                                <p className="text-sm font-bold text-slate-500 uppercase mt-1">{tx.sender} • {tx.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-white tracking-tighter">{tx.amount.toFixed(2)} MON</p>
                            <p className="text-xs font-black uppercase text-indigo-500/70 mt-1">{tx.timestamp} • Success</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
