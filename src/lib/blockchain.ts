import { ethers } from 'ethers';

// ABI for a simple ERC20 token reward contract
const REWARD_ABI = [
  'function distributeRewards(address[] recipients, uint256[] amounts) external',
  'function claimReward(uint256 rewardId) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
];

// Initialize blockchain provider
export const getProvider = () => {
  const network = process.env.ETHEREUM_NETWORK || 'goerli';
  const providerUrl = process.env.ETHEREUM_PROVIDER_URL;

  if (!providerUrl) {
    throw new Error('ETHEREUM_PROVIDER_URL is not defined in environment variables');
  }

  return new ethers.providers.JsonRpcProvider(providerUrl);
};

// Get contract instance
export const getRewardContract = (contractAddress: string) => {
  const provider = getProvider();
  const privateKey = process.env.CONTRACT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('CONTRACT_PRIVATE_KEY is not defined in environment variables');
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, REWARD_ABI, wallet);
};

// Distribute rewards to multiple recipients
export const distributeRewards = async (
  contractAddress: string,
  recipients: string[],
  amounts: string[]
) => {
  try {
    if (recipients.length !== amounts.length) {
      throw new Error('Recipients and amounts arrays must have the same length');
    }

    const contract = getRewardContract(contractAddress);
    const tx = await contract.distributeRewards(recipients, amounts);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Error distributing rewards:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Claim a specific reward
export const claimReward = async (
  contractAddress: string,
  rewardId: string,
  userWalletAddress: string
) => {
  try {
    const contract = getRewardContract(contractAddress);

    // For better UX, we'll use the contract owner to pay for gas
    const tx = await contract.claimReward(rewardId);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Error claiming reward:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Get token balance of an address
export const getTokenBalance = async (contractAddress: string, walletAddress: string) => {
  try {
    const contract = getRewardContract(contractAddress);
    const balance = await contract.balanceOf(walletAddress);

    return {
      success: true,
      balance: balance.toString(),
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      balance: '0',
    };
  }
};

// Transfer tokens
export const transferTokens = async (
  contractAddress: string,
  recipientAddress: string,
  amount: string
) => {
  try {
    const contract = getRewardContract(contractAddress);
    const tx = await contract.transfer(recipientAddress, amount);
    const receipt = await tx.wait();

    return {
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
