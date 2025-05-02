// utils/transaction.ts
import { ethers } from 'ethers';

export interface TransactionConfig {
  to: string;
  value?: string | number; // in ETH
  data?: string;
  gasLimit?: number;
}

export interface ContractTransactionConfig {
  contractAddress: string;
  abi: ethers.ContractInterface;
  method: string;
  params: any[];
  value?: string | number;
}

export class TransactionService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
  }

  // Send ETH or interact with basic contracts
  async sendTransaction(config: TransactionConfig) {
    try {
      const tx = await this.signer.sendTransaction({
        to: config.to,
        value: config.value ? ethers.utils.parseEther(config.value.toString()) : 0,
        data: config.data || '0x',
        gasLimit: config.gasLimit || undefined,
      });

      const receipt = await tx.wait();
      return {
        success: true,
        hash: receipt.transactionHash,
        receipt,
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Interact with smart contracts
  async sendContractTransaction(config: ContractTransactionConfig) {
    try {
      const contract = new ethers.Contract(config.contractAddress, config.abi, this.signer);

      const tx = await contract[config.method](...config.params, {
        value: config.value ? ethers.utils.parseEther(config.value.toString()) : 0,
      });

      const receipt = await tx.wait();
      return {
        success: true,
        hash: receipt.transactionHash,
        receipt,
      };
    } catch (error) {
      console.error('Contract transaction failed:', error);
      throw error;
    }
  }

  // Sign a message
  async signMessage(message: string) {
    try {
      const signature = await this.signer.signMessage(message);
      return {
        success: true,
        signature,
        message,
      };
    } catch (error) {
      console.error('Message signing failed:', error);
      throw error;
    }
  }

  // Sign typed data (EIP-712)
  async signTypedData(domain: any, types: any, value: any) {
    try {
      // Remove the unwanted _type key if present
      const domainWithoutType = { ...domain };
      delete domainWithoutType._type;

      const signature = await (this.provider.getSigner() as any)._signTypedData(
        domainWithoutType,
        types,
        value
      );

      return {
        success: true,
        signature,
        value,
      };
    } catch (error) {
      console.error('Typed data signing failed:', error);
      throw error;
    }
  }
}
