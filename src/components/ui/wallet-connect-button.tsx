'use client';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { toast } from 'sonner';
import { Wallet, Loader2 } from 'lucide-react';
import { useCustomWallet } from '@/context/CustomWalletContext';

export default function WalletConnectButton() {
  const { wallet, isConnecting, connect } = useCustomWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  if (!isClient) {
    return (
      <Button disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnectWallet}
      disabled={isConnecting || !!wallet}
      className="flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : wallet ? (
        <>
          <Wallet className="h-4 w-4" />
          Connected
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
