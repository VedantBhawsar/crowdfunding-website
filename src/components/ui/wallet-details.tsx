'use client';

import { useCustomWallet } from '@/context/CustomWalletContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function WalletDetails() {
  const { wallet, refreshWallet } = useCustomWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Details</CardTitle>
          <CardDescription>Connect your wallet to see details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No wallet connected</p>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const openExplorer = () => {
    const baseUrl = getExplorerUrl(wallet.chainId);
    window.open(`${baseUrl}/address/${wallet.address}`, '_blank');
  };

  const getExplorerUrl = (chainId: number): string => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      5: 'https://goerli.etherscan.io',
      11155111: 'https://sepolia.etherscan.io',
      137: 'https://polygonscan.com',
      80001: 'https://mumbai.polygonscan.com',
      42161: 'https://arbiscan.io',
      43114: 'https://snowtrace.io',
      56: 'https://bscscan.com',
    };

    return explorers[chainId] || 'https://etherscan.io';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWallet();
      toast.success('Wallet information refreshed');
    } catch (error) {
      toast.error('Failed to refresh wallet information');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Wallet Details</CardTitle>
          <CardDescription>Your connected wallet information</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Wallet Address</Label>
          <div className="flex items-center space-x-2">
            <Input id="address" readOnly value={wallet.address} className="font-mono text-xs" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(wallet.address, 'Address')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={openExplorer}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="balance">Balance</Label>
            <Input id="balance" readOnly value={`${Number(wallet.balance).toFixed(6)} ETH`} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <div className="flex items-center space-x-2">
              <Badge variant={wallet.chainId === 1 ? 'default' : 'secondary'}>
                {wallet.networkName}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
