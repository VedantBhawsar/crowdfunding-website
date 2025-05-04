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
        
        const controller= await connector.connect();
        console.log(controller)
        toast.success('Wallet connected successfully');
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
