import { motion } from 'framer-motion';
import { AgentIntelligenceCard } from '../components/cards/AgentIntelligenceCard';
import type { Agent } from '../types';

interface AgentsTabProps {
    agents: Agent[];
    riskScore: number;
    onSelectAgent: (agentId: string) => void;
}

/**
 * Agents tab displaying all agent intelligence cards
 */
export function AgentsTab({ agents, riskScore, onSelectAgent }: AgentsTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
            {agents.map(agent => (
                <AgentIntelligenceCard
                    key={agent.id}
                    agent={agent}
                    riskScore={riskScore}
                    onClick={() => onSelectAgent(agent.id)}
                />
            ))}
        </motion.div>
    );
}
