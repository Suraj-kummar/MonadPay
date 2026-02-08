import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere, Float, Stars, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
    LayoutDashboard, Users, ArrowRightLeft, Zap, Globe, ShieldCheck,
    Terminal, ShieldAlert, TrendingUp, ZapOff, Plus, X, Activity
} from 'lucide-react';
import { Cpu, Database, Lightbulb } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as THREE from 'three';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---
type AgentStatus = 'working' | 'idle' | 'offline';

interface Agent {
    id: string;
    name: string;
    type: string;
    balance: number;
    allowance: number;
    allowanceUsed: number;
    status: AgentStatus;
    currentThought?: string;
    riskAversion: number;
    specialization: 'Coordinator' | 'Compute' | 'Security' | 'Liquidity' | 'Data';
    successRate: number;
    gasSaved: number;
}

interface Proposal {
    id: string;
    title: string;
    description: string;
    proposer: string;
    votesFor: number;
    votesAgainst: number;
    status: 'Active' | 'Passed' | 'Rejected';
    type: 'Security' | 'Optimization' | 'Expansion';
}

interface Transaction {
    id: string;
    sender: string;
    recipient: string;
    amount: number;
    type: 'Compute' | 'Data' | 'Storage';
    status: 'Completed' | 'Pending' | 'Failed';
    timestamp: string;
    realTimestamp: number;
}

interface VerifiedService {
    id: string;
    name: string;
    address: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    trustScore: number;
}

// --- Mock Data ---

const VERIFIED_SERVICES: VerifiedService[] = [
    { id: 'vs1', name: 'Monad Compute Protocol', address: '0xMON...COMP', icon: Cpu, category: 'Infrastructure', trustScore: 99.9 },
    { id: 'vs2', name: 'Moltiverse Data Store', address: '0xMON...DATA', icon: Database, category: 'Storage', trustScore: 98.5 },
    { id: 'vs3', name: 'Pyth Network Oracle', address: '0xPYTH...MON', icon: Globe, category: 'Data', trustScore: 99.2 },
    { id: 'vs4', name: 'Monad API Nexus', address: '0xMON...API', icon: Lightbulb, category: 'AI Services', trustScore: 97.8 },
];

const AGENT_THOUGHTS = [
    "Analyzing gas price trends...",
    "Optimizing batch execution...",
    "Verifying recipient reputation...",
    "Syncing with mesh network...",
    "Risk Engine: Monitoring network load.",
    "Negotiating compute rates...",
    "Rebalancing liquidity pools..."
];

const INITIAL_AGENTS: Agent[] = [
    { id: 'a1', name: 'Nexus_Orchestrator', type: 'Coordinator', balance: 12450.00, allowance: 5000, allowanceUsed: 1230.50, status: 'working', currentThought: "Coordinating swarm tasks...", riskAversion: 0.3, specialization: 'Coordinator', successRate: 99.8, gasSaved: 124.50 },
    { id: 'a2', name: 'Render_Swarm_01', type: 'Compute Node', balance: 5250.75, allowance: 2500, allowanceUsed: 1490.00, status: 'idle', currentThought: "Cooling down circuits.", riskAversion: 0.8, specialization: 'Compute', successRate: 96.5, gasSaved: 45.20 },
    { id: 'a3', name: 'Data_Harvester_X', type: 'Scraper', balance: 2890.20, allowance: 1000, allowanceUsed: 45.00, status: 'working', currentThought: "Scraping dark web nodes...", riskAversion: 0.5, specialization: 'Data', successRate: 98.2, gasSaved: 12.80 },
    { id: 'a4', name: 'Sentinel_Prime', type: 'Security', balance: 8200.00, allowance: 2000, allowanceUsed: 0.00, status: 'idle', currentThought: "Monitoring firewall logs.", riskAversion: 0.1, specialization: 'Security', successRate: 100.0, gasSaved: 0.00 },
];

const INITIAL_PROPOSALS: Proposal[] = [
    { id: 'p1', title: 'Expand Compute Swarm', description: 'Authorize creation of 5 new compute sub-nodes for higher parallel processing.', proposer: 'Nexus_Orchestrator', votesFor: 1240, votesAgainst: 120, status: 'Active', type: 'Expansion' },
    { id: 'p2', title: 'Hardened Firewall Patch', description: 'Emergency security patch for Sentinel Prime to detect zero-day exploits.', proposer: 'Sentinel_Prime', votesFor: 4500, votesAgainst: 0, status: 'Active', type: 'Security' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 'tx1', sender: 'Nexus_Orchestrator', recipient: 'Render_Swarm_01', amount: 120.50, type: 'Compute', status: 'Completed', timestamp: '2 mins ago', realTimestamp: Date.now() - 120000 },
    { id: 'tx2', sender: 'Data_Harvester_X', recipient: 'External_API', amount: 15.00, type: 'Data', status: 'Completed', timestamp: '15 mins ago', realTimestamp: Date.now() - 900000 },
];

// --- 3D Components ---

const SwarmParticles = ({ count = 500, riskLevel }: { count?: number, riskLevel: number }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 2 + Math.random() * 3;
            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi);
        }
        return p;
    }, [count]);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * (0.1 + riskLevel * 0.5);
            pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <Points ref={pointsRef} positions={points} stride={3}>
            <PointMaterial
                transparent
                color={riskLevel > 0.7 ? "#f43f5e" : "#836EF1"}
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};

const AICore = ({ intensity, riskLevel }: { intensity: number, riskLevel: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
            const s = 1 + Math.sin(state.clock.getElapsedTime() * 5) * (intensity * 0.1);
            meshRef.current.scale.set(s, s, s);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[1.5, 64, 64]} ref={meshRef}>
                <MeshDistortMaterial
                    color={riskLevel > 0.7 ? "#f43f5e" : (intensity > 0.5 ? "#8b5cf6" : "#6366f1")}
                    attach="material"
                    distort={0.3 + (intensity * 0.4)}
                    speed={2 + (intensity * 3)}
                    roughness={0}
                    metalness={1}
                    emissive={riskLevel > 0.7 ? "#881337" : (intensity > 0.5 ? "#5b21b6" : "#4c1d95")}
                    emissiveIntensity={1}
                />
            </Sphere>
            <SwarmParticles riskLevel={riskLevel} />
        </Float>
    );
};

const SceneBackground = ({ activityLevel, riskLevel }: { activityLevel: number, riskLevel: number }) => {
    return (
        <Canvas className="absolute inset-0 z-0 bg-slate-950" camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color={riskLevel > 0.7 ? "#f43f5e" : "#c084fc"} />
            <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={1} />
            <AICore intensity={activityLevel} riskLevel={riskLevel} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    );
};

// --- UI Components ---

const ParallaxCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={cn("perspective-1000", className)}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

const KPICard = ({ title, value, change, icon: Icon, trend, theme }: { title: string, value: string, change: string, icon: React.ComponentType<{ className?: string }>, trend: 'up' | 'down' | 'neutral', theme: keyof typeof THEMES }) => {
    const colors = THEMES[theme];
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
};

// ... (Other components updated for aesthetics)

const THEMES = {
    indigo: { main: "bg-[#836EF1]", text: "text-[#836EF1]", light: "bg-[#836EF1]/10" },
    violet: { main: "bg-[#A0055D]", text: "text-[#A0055D]", light: "bg-[#A0055D]/10" },
    emerald: { main: "bg-[#00FF85]", text: "text-[#00FF85]", light: "bg-[#00FF85]/10" },
};

export default function AgentPayDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENTS[0].id);
    const [amount, setAmount] = useState('');
    const [serviceType] = useState('Compute');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);

    const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
    const [prices, setPrices] = useState({ mon: 3.45, eth: 2500, sol: 140 });
    const [isJudgeMode, setIsJudgeMode] = useState(false);
    const [isPriceLoading, setIsPriceLoading] = useState(false);

    // Web3 & Persistence State
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    // Smart Input & Risk Engine State
    const [recipientInput, setRecipientInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

    const [gasPrice, setGasPrice] = useState(15);
    const [networkLoad, setNetworkLoad] = useState(42);
    const [isGasLoading, setIsGasLoading] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('Monad Testnet');

    const riskScore = useMemo(() => (gasPrice / 100) * 0.6 + (networkLoad / 100) * 0.4, [gasPrice, networkLoad]);
    const totalVolume = useMemo(() => transactions.reduce((acc, tx) => acc + tx.amount, 0), [transactions]);

    // --- Persistence Logic ---

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedAgents = localStorage.getItem('agentpay_agents');
        const savedTransactions = localStorage.getItem('agentpay_transactions');
        const savedWallet = localStorage.getItem('agentpay_wallet');

        if (savedAgents) setAgents(JSON.parse(savedAgents));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedWallet) {
            const walletData = JSON.parse(savedWallet);
            setIsWalletConnected(walletData.connected);
            setUserAddress(walletData.address);
        }
    }, []);

    // Save to LocalStorage on changes
    useEffect(() => {
        localStorage.setItem('agentpay_agents', JSON.stringify(agents));
    }, [agents]);

    useEffect(() => {
        localStorage.setItem('agentpay_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('agentpay_wallet', JSON.stringify({ connected: isWalletConnected, address: userAddress }));
    }, [isWalletConnected, userAddress]);

    // --- Web3 Logic ---

    const connectWallet = async () => {
        try {
            // Simulation of wallet connection
            const mockAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
            setIsWalletConnected(true);
            setUserAddress(mockAddress);
            setToast({ message: "Neural Link Established", type: "success" });
        } catch (error) {
            setToast({ message: "Connection Failed", type: "error" });
        }
    };

    const disconnectWallet = () => {
        setIsWalletConnected(false);
        setUserAddress(null);
        setToast({ message: "Neural Link Severed", type: "warning" });
    };

    useEffect(() => {
        const fetchPrices = async () => {
            setIsPriceLoading(true);
            try {
                // In a real app, this would be a fetch to CoinGecko
                // Using a simulation that mimics API variability for Phase 6
                const monChange = (Math.random() - 0.5) * 0.1;
                const ethChange = (Math.random() - 0.5) * 50;
                const solChange = (Math.random() - 0.5) * 5;
                setPrices(prev => ({
                    mon: Math.max(0.1, prev.mon + monChange),
                    eth: Math.max(1000, prev.eth + ethChange),
                    sol: Math.max(10, prev.sol + solChange)
                }));
            } catch (error) {
                console.error("Price fetch failed", error);
            } finally {
                setIsPriceLoading(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleVote = (proposalId: string, side: 'for' | 'against') => {
        setProposals(prev => prev.map(p => {
            if (p.id === proposalId) {
                return {
                    ...p,
                    votesFor: side === 'for' ? p.votesFor + 100 : p.votesFor,
                    votesAgainst: side === 'against' ? p.votesAgainst + 100 : p.votesAgainst
                };
            }
            return p;
        }));
        setToast({ message: "Governance Vote Cast (100 Weight)", type: "success" });
    };

    // --- Simulation Logic ---

    useEffect(() => {
        const interval = setInterval(() => {
            setIsGasLoading(true);
            setTimeout(() => {
                setGasPrice(prev => Math.max(5, Math.min(120, prev + (Math.random() < 0.5 ? -1.5 : 2) * Math.random() * 8)));
                setNetworkLoad(prev => Math.max(10, Math.min(98, prev + (Math.random() < 0.5 ? -3 : 3) * Math.random() * 5)));
                setIsGasLoading(false);
            }, 800);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(a => {
                let thought = a.currentThought;
                if (riskScore > 0.8 && a.riskAversion > 0.2) {
                    thought = `!! HIGH RISK !! Pausing non-critical operations. (Risk: ${(riskScore * 100).toFixed(0)}%)`;
                } else if (Math.random() > 0.9) {
                    thought = AGENT_THOUGHTS[Math.floor(Math.random() * AGENT_THOUGHTS.length)];
                }
                return { ...a, currentThought: thought };
            }));

            // Auto-transactions only if risk is low
            if (riskScore < 0.7 && Math.random() > 0.8) {
                const randomAgent = agents[Math.floor(Math.random() * agents.length)];
                const newTx: Transaction = {
                    id: `tx-ai-${Date.now()}`,
                    sender: randomAgent.name,
                    recipient: VERIFIED_SERVICES[Math.floor(Math.random() * 4)].name,
                    amount: parseFloat((Math.random() * 20).toFixed(2)),
                    type: ['Compute', 'Data', 'Storage'][Math.floor(Math.random() * 3)] as any,
                    status: 'Completed',
                    timestamp: 'Just now',
                    realTimestamp: Date.now()
                };
                setTransactions(prev => [newTx, ...prev].slice(0, 30));
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [agents, riskScore]);

    // --- Judge Mode Presentation Engine ---
    useEffect(() => {
        if (!isJudgeMode) return;

        const interval = setInterval(() => {
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            const randomService = VERIFIED_SERVICES[Math.floor(Math.random() * VERIFIED_SERVICES.length)];
            const amt = Math.floor(Math.random() * 50) + 10;

            const newTx: Transaction = {
                id: `tx-${Date.now()}`,
                sender: randomAgent.name,
                recipient: randomService.name,
                amount: amt,
                type: 'Compute',
                status: 'Completed',
                timestamp: 'Just now',
                realTimestamp: Date.now()
            };

            setTransactions(prev => [newTx, ...prev].slice(0, 50));
            setAgents(prev => prev.map(a =>
                a.id === randomAgent.id ? { ...a, allowanceUsed: Math.min(a.allowance, a.allowanceUsed + amt) } : a
            ));
        }, 1200);

        return () => clearInterval(interval);
    }, [isJudgeMode, agents]);

    const handlePay = () => {
        const agent = agents.find(a => a.id === selectedAgentId);
        const payAmount = parseFloat(amount);
        const finalRecipient = resolvedAddress || recipientInput;

        if (!agent) return;

        // Risk Intelligence
        if (riskScore > 0.85 && agent.riskAversion > 0.1) {
            setToast({ message: 'Agent refused: Network risk threshold exceeded.', type: 'warning' });
            return;
        }

        if (isNaN(payAmount) || payAmount <= 0) {
            setToast({ message: 'Invalid amount', type: 'error' });
            return;
        }
        if (agent.balance < payAmount) {
            setToast({ message: 'Insufficient balance', type: 'error' });
            return;
        }

        setAgents(prev => prev.map(a => {
            if (a.id === selectedAgentId) {
                return { ...a, balance: a.balance - payAmount, allowanceUsed: a.allowanceUsed + payAmount };
            }
            return a;
        }));

        const newTx: Transaction = {
            id: `tx${Date.now()}`,
            sender: agent.name,
            recipient: finalRecipient,
            amount: payAmount,
            type: serviceType as any,
            status: 'Completed',
            timestamp: 'Just now',
            realTimestamp: Date.now()
        };

        setTransactions(prev => [newTx, ...prev]);
        setToast({ message: `Securely routed to ${finalRecipient}`, type: 'success' });
        setShowModal(false);
        setAmount('');
        setRecipientInput('');
        setResolvedAddress(null);
    };

    return (
        <div className="relative h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/50 overflow-hidden cursor-default">

            {/* Premium 3D Layer */}
            <div className="fixed inset-0 z-0">
                <SceneBackground activityLevel={transactions.length / 50} riskLevel={riskScore} />
            </div>

            {/* Cinematic Noise Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            <div className="fixed inset-0 z-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex h-full">
                {/* Visual Sidebar */}
                <aside className="w-80 bg-slate-950/20 backdrop-blur-3xl border-r border-white/10 flex flex-col hidden lg:flex">
                    <div className="p-8">
                        <div className="flex items-center space-x-4 mb-12">
                            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                <Zap className="w-7 h-7 text-indigo-600 fill-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tighter">AgentPay</h1>
                                <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase opacity-70">Intelligence Layer</span>
                            </div>
                        </div>

                        <nav className="space-y-3">
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
                            >
                                <div className="flex items-center space-x-3">
                                    <ShieldCheck className="w-5 h-5" />
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
                                        <motion.div
                                            animate={{ width: `${riskScore * 100}%` }}
                                            className={cn("h-full", riskScore > 0.7 ? "bg-rose-500" : "bg-indigo-500")}
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

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
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
                            onClick={() => setShowModal(true)}
                            className="bg-white text-black px-10 py-5 rounded-full font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center space-x-3 group"
                        >
                            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                            <span>Initiate Pulse</span>
                        </motion.button>
                    </header>

                    <AnimatePresence mode='wait'>
                        {activeTab === 'dashboard' && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="space-y-16"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <KPICard title="Primary Balance" value={`${totalVolume.toLocaleString()} MON`} change="+12.4%" icon={TrendingUp} trend="up" theme="indigo" />
                                    <KPICard title="Network Nodes" value={agents.filter(a => a.status === 'working').length.toString()} change="Nominal" icon={Zap} trend="neutral" theme="violet" />
                                    <KPICard title="Parallelism" value="98.2%" change="Optimized" icon={Activity} trend="up" theme="emerald" />
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
                                                {transactions.slice(0, 8).map(tx => (
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
                        )}

                        {activeTab === 'agents' && (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {agents.map(agent => (
                                    <AgentIntelligenceCard
                                        key={agent.id}
                                        agent={agent}
                                        riskScore={riskScore}
                                        onClick={() => {
                                            setSelectedAgentId(agent.id);
                                            // Expanding existing modal logic for profiles
                                            // In a real app we'd have a separate profile modal state
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'transactions' && (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden">
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
                        )}

                        {activeTab === 'governance' && (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
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
                                                        onClick={() => handleVote(proposal.id, 'for')}
                                                        className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVote(proposal.id, 'against')}
                                                        className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all"
                                                    >
                                                        <ZapOff className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="relative w-full max-w-2xl bg-white/[0.02] border border-white/20 rounded-[50px] overflow-hidden p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h3 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Initiate Pulse</h3>
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Neural Transfer Protocol Alpha</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4">Source Intelligence</label>
                                    <select value={selectedAgentId} onChange={e => setSelectedAgentId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-black outline-none appearance-none cursor-pointer hover:border-white/20">
                                        {agents.map(a => <option key={a.id} value={a.id} className="bg-slate-900">{a.name} ({a.balance.toLocaleString()} MON)</option>)}
                                    </select>
                                </div>

                                <div className="space-y-4 relative">
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4 flex justify-between">
                                        <span>Target Registry</span>
                                        {resolvedAddress && <span className="text-emerald-400">!! Verified Neural Path !!</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            placeholder="DNS or Neural Hex..."
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-black outline-none placeholder:opacity-20"
                                            value={recipientInput}
                                            onChange={e => {
                                                setRecipientInput(e.target.value);
                                                if (e.target.value.includes('.eth')) setResolvedAddress("0x7F...[AUTO-RESOLVED]");
                                                else setResolvedAddress(null);
                                                setShowSuggestions(true);
                                            }}
                                        />
                                        {showSuggestions && !resolvedAddress && (
                                            <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden z-50 shadow-2xl">
                                                {VERIFIED_SERVICES.map(s => (
                                                    <div key={s.id} onClick={() => { setRecipientInput(s.name); setResolvedAddress(s.address); setShowSuggestions(false); }} className="p-6 hover:bg-white/5 cursor-pointer flex items-center space-x-4 border-b border-white/5 last:border-0">
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
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4">Volume</label>
                                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-black outline-none" placeholder="0.00" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-4">Priority</label>
                                        <div className="h-[76px] bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center font-black text-white text-xl">
                                            {riskScore > 0.7 ? "Safety Lock Active" : "Turbo Routed"}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePay}
                                    className="w-full bg-indigo-600 py-8 rounded-[30px] font-black text-2xl text-white uppercase tracking-tighter shadow-[0_30px_60px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    Broadcast Pulse
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Dynamic Toasts */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className={cn(
                        "fixed top-12 right-12 p-8 rounded-[30px] shadow-2xl border flex items-center space-x-6 backdrop-blur-3xl z-[200]",
                        toast.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            toast.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    )}>
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

// --- Sub-components (Separated for clarity) ---

const SidebarButton = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={cn(
        "w-full flex items-center space-x-4 px-6 py-5 rounded-3xl transition-all font-black text-sm uppercase tracking-widest group",
        active ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-white"
    )}>
        <Icon className={cn("w-5 h-5", active ? "text-indigo-600" : "group-hover:text-indigo-400")} />
        <span>{label}</span>
    </button>
);

const AgentIntelligenceCard = ({ agent, riskScore, onClick }: { agent: Agent, riskScore: number, onClick: () => void }) => {
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
};
