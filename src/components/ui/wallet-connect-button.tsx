'use client';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { useAppKitAccount } from '@reown/appkit/react';
import { toast } from 'sonner';
import { Wallet } from 'lucide-react';

export default function WalletConnectButton() {
  const { isConnected } = useAppKitAccount();
  const [isAppKitLoaded, setIsAppKitLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('appkit-button')) {
      console.warn('AppKit button component not found, using fallback button');
    } else {
      setIsAppKitLoaded(true);
    }
  }, []);

  const handleConnectWallet = async () => {
    if (!isAppKitLoaded) {
      setIsConnecting(true);
      try {
        const { wagmiAdapter } = await import('@/config/wagmi');
        const connector = wagmiAdapter.wagmiConfig.connectors[0];
        
        if (!connector) {
          throw new Error('No wallet connector available');
        }
        
        // Try to connect with explicit parameters
        await connector.connect({
          chainId: 1, // Ethereum mainnet
        });
        
        // Wait a moment for the connection to establish
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify connection
        // @ts-ignore
        const account = await connector.getAccount();
        if (!account) {
          throw new Error('Failed to connect wallet');
        }
        
        toast.success('Wallet connected successfully');
        
        // Force a page refresh to update the UI
        window.location.reload();
      } catch (error) {
        console.error('Wallet connection error:', error);
        toast.error('Wallet connection failed. Please try again later.');
      } finally {
        setIsConnecting(false);
      }
      return;
    }
  };

  if (isAppKitLoaded) {
    return <appkit-button />;
  }
  return (
    <Button 
      onClick={handleConnectWallet} 
      disabled={isConnecting}
      className="flex items-center gap-2"
    >
      <Wallet size={16} />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}
