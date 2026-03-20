import { useState, useEffect, useMemo } from 'react';
import { GAS_UPDATE_INTERVAL } from '../constants/mockData';

/**
 * Custom hook for risk engine simulation
 * Monitors gas prices and network load
 */
export function useRiskEngine() {
    const [gasPrice, setGasPrice] = useState(15);
    const [networkLoad, setNetworkLoad] = useState(42);
    const [isGasLoading, setIsGasLoading] = useState(false);

    // Calculate risk score based on gas price and network load
    const riskScore = useMemo(
        () => (gasPrice / 100) * 0.6 + (networkLoad / 100) * 0.4,
        [gasPrice, networkLoad]
    );

    // Simulate gas price and network load changes
    useEffect(() => {
        const interval = setInterval(() => {
            setIsGasLoading(true);
            setTimeout(() => {
                setGasPrice(prev =>
                    Math.max(5, Math.min(120, prev + (Math.random() < 0.5 ? -1.5 : 2) * Math.random() * 8))
                );
                setNetworkLoad(prev =>
                    Math.max(10, Math.min(98, prev + (Math.random() < 0.5 ? -3 : 3) * Math.random() * 5))
                );
                setIsGasLoading(false);
            }, 800);
        }, GAS_UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return {
        gasPrice,
        networkLoad,
        riskScore,
        isGasLoading
    };
}
