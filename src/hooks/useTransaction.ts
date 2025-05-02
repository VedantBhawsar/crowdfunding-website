'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { type BaseError } from 'viem';
import { type Config, type ResolvedRegister } from 'wagmi';
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  type UseSendTransactionParameters,
  // Corrected import name: UseWaitForTransactionReceiptReturnType is not exported, use the hook's return type directly if needed
  // For the data type in onSuccess, we can infer or use the specific type from useWaitForTransactionReceipt hook result
} from 'wagmi';
import { useToast } from './use-toast';
import { type SendTransactionParameters } from 'viem'; // Import from viem

// Define the type for the parameters expected by executeTransaction
// This aligns with Viem's SendTransactionParameters
export type ExecuteTransactionParameters = SendTransactionParameters;

export function useTransaction() {
  const { toast } = useToast();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const {
    // data: sendDataHash, // Renamed original data to avoid conflict if needed, but hash from mutation.onSuccess is sufficient
    error: sendError,
    isPending: isSending,
    sendTransaction,
    reset: resetSendTransaction,
  } = useSendTransaction({
    mutation: {
      onSuccess: hash => {
        setTxHash(hash); // Set the hash state when transaction is sent
        toast({
          title: 'Transaction Sent',
          description: `Transaction hash: ${hash}`,
          variant: 'default',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Transaction Failed to Send',
          description: (error as BaseError)?.shortMessage || error.message,
          variant: 'destructive',
        });
        setTxHash(undefined); // Clear hash on send error
      },
    },
  });

  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
    status: confirmationStatus, // Get status for more detailed feedback
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash, // Only run query if txHash exists
    },
  });

  // Show toast on confirmation status change using useEffect
  useEffect(() => {
    if (confirmationStatus === 'success' && receipt) {
      toast({
        title: 'Transaction Confirmed',
        description: `Transaction included in block ${receipt.blockNumber}. Status: ${receipt.status}`,
        variant: 'default', // Use default variant
      });
    } else if (confirmationStatus === 'error' && receiptError) {
      toast({
        title: 'Confirmation Failed',
        description: (receiptError as BaseError)?.shortMessage || receiptError.message,
        variant: 'destructive',
      });
    }
    // Consider adding handling for 'reverted' status from receipt if needed
    // else if (receipt?.status === 'reverted') { ... }
  }, [confirmationStatus, receipt, receiptError, toast]);

  const executeTransaction = (params: ExecuteTransactionParameters) => {
    // Reset previous send state and hash before sending a new transaction
    resetSendTransaction();
    setTxHash(undefined);
    sendTransaction(params); // Pass parameters directly
  };

  // Consolidate loading state
  const isLoading = isSending || isConfirming;

  // Consolidate error state
  const error = sendError || receiptError;

  return {
    executeTransaction,
    hash: txHash, // The hash of the transaction being tracked
    receipt, // The receipt when confirmed
    isLoading, // Combined loading state
    isSending, // Specific state: transaction is being sent
    isConfirming, // Specific state: transaction is waiting for confirmation
    isConfirmed, // Specific state: transaction is confirmed
    error, // Combined error state
    resetSendTransaction, // Function to reset the send transaction state
    confirmationStatus, // Detailed status from useWaitForTransactionReceipt
  };
}
