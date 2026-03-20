import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Agent, ToastMessage } from '../../types';
import { VERIFIED_SERVICES } from '../../constants/mockData';

interface PaymentModalProps {
    show: boolean;
    onClose: () => void;
    agents: Agent[];
    selectedAgentId: string;
    setSelectedAgentId: (id: string) => void;
    riskScore: number;
    onPay: (agentId: string, recipient: string, amount: number, resolvedAddress: string | null) => ToastMessage;
}

/**
 * Payment modal with smart recipient suggestions and keyboard navigation
 */
export function PaymentModal({
    show,
    onClose,
    agents,
    selectedAgentId,
    setSelectedAgentId,
    riskScore,
    onPay
}: PaymentModalProps) {
    const [recipientInput, setRecipientInput] = useState('');
    const [amount, setAmount] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

    const handleSubmit = () => {
        const payAmount = parseFloat(amount);
        const finalRecipient = resolvedAddress || recipientInput;

        const result = onPay(selectedAgentId, finalRecipient, payAmount, resolvedAddress);

        if (result.type === 'success') {
            setAmount('');
            setRecipientInput('');
            setResolvedAddress(null);
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter' && amount && recipientInput) {
            handleSubmit();
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="payment-modal-title"
                    onKeyDown={handleKeyDown}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="relative w-full max-w-2xl bg-white/[0.02] border border-white/20 rounded-[50px] overflow-hidden p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 id="payment-modal-title" className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Initiate Pulse</h3>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Neural Transfer Protocol Alpha</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label htmlFor="agent-select" className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4">Source Intelligence</label>
                                <select
                                    id="agent-select"
                                    value={selectedAgentId}
                                    onChange={e => setSelectedAgentId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-black outline-none appearance-none cursor-pointer hover:border-white/20 focus:border-indigo-500"
                                >
                                    {agents.map(a => <option key={a.id} value={a.id} className="bg-slate-900">{a.name} ({a.balance.toLocaleString()} MON)</option>)}
                                </select>
                            </div>

                            <div className="space-y-4 relative">
                                <label htmlFor="recipient-input" className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4 flex justify-between">
                                    <span>Target Registry</span>
                                    {resolvedAddress && <span className="text-emerald-400">!! Verified Neural Path !!</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        id="recipient-input"
                                        placeholder="DNS or Neural Hex..."
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-black outline-none placeholder:opacity-20 focus:border-indigo-500"
                                        value={recipientInput}
                                        onChange={e => {
                                            setRecipientInput(e.target.value);
                                            if (e.target.value.includes('.eth')) setResolvedAddress("0x7F...[AUTO-RESOLVED]");
                                            else setResolvedAddress(null);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                    {showSuggestions && !resolvedAddress && recipientInput.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden z-50 shadow-2xl">
                                            {VERIFIED_SERVICES.map(s => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => {
                                                        setRecipientInput(s.name);
                                                        setResolvedAddress(s.address);
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="p-6 hover:bg-white/5 cursor-pointer flex items-center space-x-4 border-b border-white/5 last:border-0"
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    <s.icon className="w-6 h-6 text-indigo-400" />
                                                    <span className="font-black text-white">{s.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label htmlFor="amount-input" className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4">Volume</label>
                                    <input
                                        id="amount-input"
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-black outline-none focus:border-indigo-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4">Priority</label>
                                    <div className="h-[76px] bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center font-black text-white text-xl">
                                        {riskScore > 0.7 ? "Safety Lock Active" : "Turbo Routed"}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!amount || !recipientInput}
                                className={cn(
                                    "w-full py-8 rounded-[30px] font-black text-2xl text-white uppercase tracking-tighter shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all",
                                    (!amount || !recipientInput)
                                        ? "bg-slate-700 cursor-not-allowed opacity-50"
                                        : "bg-indigo-600 hover:scale-[1.02] active:scale-95"
                                )}
                                aria-label="Submit payment"
                            >
                                Broadcast Pulse
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
