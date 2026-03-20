import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import type { ToastMessage } from '../types';

/**
 * Custom hook for real Web3 wallet connection management using ethers.js
 */
export function useWallet() {
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    // Initial check for existing connection
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const provider = new BrowserProvider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        setUserAddress(accounts[0].address);
                        setIsWalletConnected(true);

                        const bal = await provider.getBalance(accounts[0].address);
                        setBalance(formatEther(bal));
                    }
                } catch (error) {
                    console.error("Failed to check wallet connection:", error);
                }
            }
        };
        checkConnection();
    }, []);

    // Listen to account changes
    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    setUserAddress(accounts[0]);
                    setIsWalletConnected(true);
                } else {
                    setUserAddress(null);
                    setIsWalletConnected(false);
                    setBalance(null);
                }
            };

            const handleChainChanged = () => {
                window.location.reload();
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    const connectWallet = useCallback(async (): Promise<ToastMessage> => {
        if (!window.ethereum) {
            return { message: "No Web3 Wallet Found (e.g., MetaMask)", type: "error" };
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setIsWalletConnected(true);
            setUserAddress(address);

            // Fetch balance
            const bal = await provider.getBalance(address);
            setBalance(formatEther(bal));

            return { message: "Neural Link Established (Web3 connected)", type: "success" };
        } catch (error: any) {
            console.error('Wallet connection failed:', error);
            if (error.code === 4001) {
                return { message: "User rejected connection request", type: "warning" };
            }
            return { message: "Connection Failed", type: "error" };
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        // Current standard practice: wallets don't allow a true "code disconnect"
        // but we can clear the local UI state.
        setIsWalletConnected(false);
        setUserAddress(null);
        setBalance(null);
        return { message: "Neural Link Severed (State cleared)", type: "warning" } as ToastMessage;
    }, []);

    return {
        isWalletConnected,
        userAddress,
        balance,
        connectWallet,
        disconnectWallet
    };
}

// Add window.ethereum typing 
declare global {
    interface Window {
        ethereum?: any;
    }
}
