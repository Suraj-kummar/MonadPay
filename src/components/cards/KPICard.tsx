import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ParallaxCard } from './ParallaxCard';
import type { Theme, ThemeColors } from '../../types';
import { THEMES } from '../../constants/mockData';

interface KPICardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ComponentType<{ className?: string }>;
    trend: 'up' | 'down' | 'neutral';
    theme: Theme;
}

/**
 * KPI card with theme-based styling and trend indicator
 */
export function KPICard({ title, value, change, icon: Icon, trend, theme }: KPICardProps) {
    const colors: ThemeColors = THEMES[theme];

    return (
        <ParallaxCard className="w-full">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-2xl h-full"
            >
                <div className={cn("absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40", colors.main)} />
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", colors.light)}>
                        <Icon className={cn("w-7 h-7", colors.text)} />
                    </div>
                    <span className={cn(
                        "text-xs font-black px-3 py-1 rounded-full border bg-white/5 backdrop-blur-md",
                        trend === 'up' ? "text-emerald-400 border-emerald-500/30" :
                            trend === 'down' ? "text-rose-400 border-rose-500/30" : "text-slate-400 border-white/10"
                    )}>
                        {change}
                    </span>
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{title}</h3>
                <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
            </motion.div>
        </ParallaxCard>
    );
}
