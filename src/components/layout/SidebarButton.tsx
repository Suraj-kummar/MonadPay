import { cn } from '../../utils/cn';

interface SidebarButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active: boolean;
    onClick: () => void;
}

/**
 * Sidebar navigation button with active state styling
 */
export function SidebarButton({ icon: Icon, label, active, onClick }: SidebarButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center space-x-4 px-6 py-5 rounded-3xl transition-all font-black text-sm uppercase tracking-widest group",
                active ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-white"
            )}
            aria-label={`Navigate to ${label}`}
            aria-current={active ? "page" : undefined}
        >
            <Icon className={cn("w-5 h-5", active ? "text-indigo-600" : "group-hover:text-indigo-400")} aria-hidden="true" />
            <span>{label}</span>
        </button>
    );
}
