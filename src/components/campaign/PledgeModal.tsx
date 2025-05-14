// components/campaign/PledgeModal.tsx (or similar)
import React, { useEffect, useState, useCallback } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Reward } from '@prisma/client'; // Import Reward type
import { taikoTestnetSepolia } from 'viem/chains';

interface PledgeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignTitle: string;
  creatorWalletAddress: string | null;
  selectedReward?: Reward | null; // Pass the selected reward object
  onSuccess: () => void; // Callback on successful DB record
}

export const PledgeModal: React.FC<PledgeModalProps> = ({
  isOpen,
  onOpenChange,
  campaignId,
  campaignTitle,
  creatorWalletAddress,
  selectedReward,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>(selectedReward?.amount.toString() || '');

  const [customAmountError, setCustomAmountError] = useState<string | null>(null);
  const { address: connectedAddress, isConnected } = useAccount();

  useEffect(() => {
    setAmount(selectedReward?.amount.toString() || '');
  }, [selectedReward]);

  const {
    data: hash,
    error: sendError,
    isPending: isSending,
    sendTransaction,
    status: transactionStatus,
    variables: transactionVariables,
  } = useSendTransaction();

  console.log('hash', hash);
  console.log('transactionStatus', transactionStatus);
  console.log('transactionVariables', transactionVariables);

  // State for backend recording process
  const [isRecording, setIsRecording] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or valid numbers (including decimals)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setCustomAmountError(null); // Clear error on valid change
      const numAmount = parseFloat(value);
      if (selectedReward && !isNaN(numAmount) && numAmount < selectedReward.amount) {
        setCustomAmountError(
          `Amount must be at least ${selectedReward.amount} ETH for this reward.`
        );
      } else {
        setCustomAmountError(null);
      }
    }
  };

  const handlePledge = async () => {
    if (!isConnected || !connectedAddress) {
      toast.error('Please connect your wallet first.');
      return;
    }
    
    // Validate creator wallet address
    if (!creatorWalletAddress) {
      toast.error("Creator's wallet address is not available.");
      return;
    }
    
    // Validate that the creator address is a proper Ethereum address
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(creatorWalletAddress)) {
      toast.error("Creator's wallet address is invalid. Please contact support.");
      console.error('Invalid creator wallet address:', creatorWalletAddress);
      return;
    }
    
    const pledgeAmount = parseFloat(amount);
    if (isNaN(pledgeAmount) || pledgeAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    
    if (customAmountError) {
      toast.error(customAmountError);
      return;
    }

    try {
      // Ensure the address is properly formatted
      if (!creatorWalletAddress.startsWith('0x')) {
        creatorWalletAddress = '0x' + creatorWalletAddress;
      }
      
      // Log the address for debugging
      console.log('Sending transaction to address:', creatorWalletAddress);
      
      // Send the transaction with proper type casting
      sendTransaction({
        to: creatorWalletAddress as `0x${string}`,
        value: parseEther(amount), // Convert ETH string to Wei BigInt
      });
    } catch (e) {
      // Catch potential synchronous errors from parseEther etc.
      console.error('Send Transaction init error:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to initiate transaction.');
    }
  };

  // Function to call backend API
  const recordContribution = useCallback(async () => {
    if (!hash) return; // Should not happen if called from onSuccess

    setIsRecording(true);
    setRecordError(null);

    try {
      const response = await fetch('/api/campaigns/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignId,
          amount: parseFloat(amount),
          txHash: hash,
          rewardId: selectedReward?.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to record contribution');
      }

      toast.success('Contribution successfully recorded!');
      onSuccess(); // Trigger parent component refresh/update
      onOpenChange(false); // Close modal
    } catch (err) {
      console.error('Recording Error:', err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setRecordError(`Failed to record contribution: ${message}`);
      toast.error(`Failed to record contribution: ${message}`);
    } finally {
      setIsRecording(false);
    }
  }, [hash, amount, campaignId, selectedReward, onSuccess, onOpenChange]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (transactionStatus === 'success') {
      timeout = setTimeout(() => {
        recordContribution();
      }, 10000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [transactionStatus, recordContribution]);

  const isLoading = isSending || isRecording;
  const error = sendError || recordError;

  console.log(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Back Campaign: {campaignTitle}</DialogTitle>
          {selectedReward && (
            <DialogDescription>
              You&apos;ve selected the reward: <strong>{selectedReward.title}</strong> (Min.{' '}
              {selectedReward.amount} ETH)
            </DialogDescription>
          )}
          {!selectedReward && (
            <DialogDescription>Enter the amount you wish to contribute.</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="text" // Use text to allow decimals easily
            inputMode="decimal" // Hint for mobile keyboards
            placeholder="e.g., 0.1"
            value={amount}
            onChange={handleAmountChange}
            disabled={isLoading || (!!selectedReward && selectedReward.amount > 0)} // Disable if reward sets amount
            className={customAmountError ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {customAmountError && <p className="text-xs text-destructive">{customAmountError}</p>}
          {!isConnected && <p className="text-sm text-destructive">Please connect your wallet.</p>}
        </div>
        <DialogFooter>
          {error && (
            <p className="text-sm text-destructive mr-auto">
              Error: {error instanceof Error ? error.message : String(error)}
            </p>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handlePledge}
            disabled={isLoading || !isConnected || !amount || !!customAmountError}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSending ? 'Check Wallet...' : isRecording ? 'Recording...' : 'Pledge Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
