'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { WalletInfo, checkWalletConnection, connectWallet, disconnectWallet } from '@/lib/wallet';

// Define custom event types
interface WalletAccountChangedEvent extends Event {
  detail: string[];
}

interface WalletChainChangedEvent extends Event {
  detail: any;
}

interface WalletDisconnectedEvent extends Event {
  detail: any;
}

// Declare global interface for the custom events
declare global {
  interface WindowEventMap {
    walletAccountChanged: WalletAccountChangedEvent;
    walletChainChanged: WalletChainChangedEvent;
    walletDisconnected: WalletDisconnectedEvent;
  }
}

interface WalletContextType {
  wallet: WalletInfo | null;
  isConnecting: boolean;
  isDisconnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function CustomWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const walletInfo = await checkWalletConnection();
        if (walletInfo) {
          setWallet(walletInfo);

          // If we have a wallet, update it in the database
          try {
            await updateWalletInDatabase(walletInfo);
          } catch (dbError) {
            console.error('Failed to update wallet in database:', dbError);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Listen for wallet events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAccountsChanged = async (event: WalletAccountChangedEvent) => {
      const accounts = event.detail;
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        // Account changed, refresh wallet info
        await refreshWallet();
      } else {
        // Disconnected
        setWallet(null);
        updateWalletInDatabase(null);
      }
    };

    const handleChainChanged = async () => {
      // Chain changed, refresh wallet info
      await refreshWallet();
    };

    const handleDisconnect = () => {
      setWallet(null);
      updateWalletInDatabase(null);
    };

    // Add event listeners
    window.addEventListener('walletAccountChanged', handleAccountsChanged);
    window.addEventListener('walletChainChanged', handleChainChanged);
    window.addEventListener('walletDisconnected', handleDisconnect);

    // Clean up event listeners
    return () => {
      window.removeEventListener('walletAccountChanged', handleAccountsChanged);
      window.removeEventListener('walletChainChanged', handleChainChanged);
      window.removeEventListener('walletDisconnected', handleDisconnect);
    };
  }, []);

  // Update wallet info in the database
  const updateWalletInDatabase = async (walletInfo: WalletInfo | null) => {
    try {
      const response = await fetch('/api/wallet/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          walletInfo
            ? {
                address: walletInfo.address,
                isConnected: true,
                caipAddress: `eip155:${walletInfo.chainId}:${walletInfo.address}`,
                balance: parseFloat(walletInfo.balance),
                networkId: walletInfo.chainId.toString(),
                lastTransactionAt: new Date().toISOString(),
                status: 'active',
              }
            : {
                address: null,
                isConnected: false,
                caipAddress: null,
                status: 'inactive',
              }
        ),
      });

      if (!response.ok) {
        throw new Error('Failed to update wallet in database');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating wallet in database:', error);
      throw error;
    }
  };

  // Connect wallet
  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const walletInfo = await connectWallet();
      if (walletInfo) {
        setWallet(walletInfo);
        await updateWalletInDatabase(walletInfo);
        toast.success('Wallet connected successfully');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError((error as Error).message || 'Failed to connect wallet');
      toast.error((error as Error).message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    setIsDisconnecting(true);
    setError(null);

    try {
      await disconnectWallet();
      setWallet(null);
      await updateWalletInDatabase(null);
      toast.success('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError((error as Error).message || 'Failed to disconnect wallet');
      toast.error((error as Error).message || 'Failed to disconnect wallet');
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Refresh wallet info
  const refreshWallet = async () => {
    try {
      const walletInfo = await checkWalletConnection();
      if (walletInfo) {
        setWallet(walletInfo);
        await updateWalletInDatabase(walletInfo);
      } else {
        setWallet(null);
        await updateWalletInDatabase(null);
      }
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        isDisconnecting,
        error,
        connect,
        disconnect,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useCustomWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useCustomWallet must be used within a CustomWalletProvider');
  }
  return context;
}
