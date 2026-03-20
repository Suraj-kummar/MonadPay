import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface HeaderProps {
    activeTab: string;
    onOpenModal: () => void;
}

/**
 * Main header with title and action button
 */
export function Header({ activeTab, onOpenModal }: HeaderProps) {
    return (
        <header className="flex justify-between items-center mb-16">
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>Neural Feed Active</span>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase">
                    {activeTab}
                </h2>
            </div>

            <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenModal}
                className="bg-white text-black px-10 py-5 rounded-full font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center space-x-3 group"
                aria-label="Open payment modal"
            >
                <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" aria-hidden="true" />
                <span>Initiate Pulse</span>
            </motion.button>
        </header>
    );
}
