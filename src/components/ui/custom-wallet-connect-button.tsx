'use client';

import { Button } from '@/components/ui/button';
import { useCustomWallet } from '@/context/CustomWalletContext';
import { Wallet, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WalletConnectButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function CustomWalletConnectButton({
  className = '',
  variant = 'default',
  size = 'default',
}: WalletConnectButtonProps) {
  const { wallet, isConnecting, isDisconnecting, connect, disconnect } = useCustomWallet();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMetaMaskInstalled(!!window.ethereum);
    }
  }, []);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  if (isMetaMaskInstalled === null) {
    // Initial loading state
    return (
      <Button variant="outline" className={className} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (wallet) {
    // Connected state
    return (
      <Button
        variant="outline"
        className={className}
        onClick={handleDisconnect}
        disabled={isDisconnecting}
      >
        {isDisconnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Disconnecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            {`${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`}
          </>
        )}
      </Button>
    );
  }

  // Not connected state
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {isMetaMaskInstalled ? 'Connect Wallet' : 'Install MetaMask'}
        </>
      )}
    </Button>
  );
}
