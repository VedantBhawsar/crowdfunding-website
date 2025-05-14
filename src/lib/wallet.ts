import { ethers } from 'ethers';

// Wallet types
export type WalletInfo = {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance: string;
  networkName: string;
};

// Default provider
export const getProvider = () => {
  if (typeof window === 'undefined') {
    // Server-side - use a default provider
    return new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo'
    );
  }

  // Client-side - check if window.ethereum is available
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum as any);
  }

  // Fallback to a public provider
  return new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo'
  );
};

// Get network name from chain ID
export const getNetworkName = (chainId: number): string => {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Mumbai Testnet',
    42161: 'Arbitrum One',
    43114: 'Avalanche C-Chain',
    56: 'BNB Smart Chain',
  };

  return networks[chainId] || `Chain ID: ${chainId}`;
};

// Connect wallet function
export const connectWallet = async (): Promise<WalletInfo | null> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Ethereum provider found. Please install MetaMask or another wallet.');
    }

    // Request access to the user's accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('No accounts found. User may have denied access.');
    }

    const address = accounts[0] as string;
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);

    // Get network information
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    // Get account balance
    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.utils.formatEther(balance);

    // Add event listeners for account and chain changes
    window.ethereum.on('accountsChanged', (accounts: any) => {
      window.dispatchEvent(new CustomEvent('walletAccountChanged', { detail: accounts }));
    });

    window.ethereum.on('chainChanged', (chainId: any) => {
      window.dispatchEvent(new CustomEvent('walletChainChanged', { detail: chainId }));
    });

    // Create and return wallet info
    const walletInfo: WalletInfo = {
      address,
      chainId,
      isConnected: true,
      balance: formattedBalance,
      networkName: getNetworkName(chainId),
    };

    return walletInfo;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Disconnect wallet function
export const disconnectWallet = async (): Promise<void> => {
  // For MetaMask and most wallets, there's no direct disconnect method
  // We can only manage the connected state in our application
  // Clear local wallet state and notify the application
  window.dispatchEvent(new CustomEvent('walletDisconnected'));
};

// Check if wallet is already connected
export const checkWalletConnection = async (): Promise<WalletInfo | null> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    // Check if already connected
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return null;
    }

    const address = accounts[0] as string;
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);

    // Get network information
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    // Get account balance
    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.utils.formatEther(balance);

    // Create and return wallet info
    const walletInfo: WalletInfo = {
      address,
      chainId,
      isConnected: true,
      balance: formattedBalance,
      networkName: getNetworkName(chainId),
    };

    return walletInfo;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return null;
  }
};

// Switch network
export const switchNetwork = async (chainId: number): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });

    return true;
  } catch (error: any) {
    // Error code 4902 means the chain hasn't been added to MetaMask
    if (error.code === 4902) {
      return await addNetwork(chainId);
    }

    console.error('Error switching network:', error);
    throw error;
  }
};

// Add network to wallet
export const addNetwork = async (chainId: number): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    const networks: Record<number, any> = {
      1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
      },
      5: {
        chainId: '0x5',
        chainName: 'Goerli Testnet',
        nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://goerli.infura.io/v3/'],
        blockExplorerUrls: ['https://goerli.etherscan.io'],
      },
      11155111: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
    };

    if (!networks[chainId]) {
      throw new Error(`Configuration for chain ID ${chainId} not found`);
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networks[chainId]],
    });

    return true;
  } catch (error) {
    console.error('Error adding network:', error);
    throw error;
  }
};

// Send transaction
export const sendTransaction = async (
  to: string,
  amount: string,
  data: string = '0x'
): Promise<string> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Ethereum provider found');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    // Convert amount from ETH to wei
    const value = ethers.utils.parseEther(amount);

    // Send transaction
    const tx = await signer.sendTransaction({
      to,
      value,
      data,
    });

    return tx.hash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

// Get token balance for ERC20 tokens
export const getTokenBalance = async (
  tokenAddress: string,
  userAddress: string
): Promise<string> => {
  try {
    const provider = getProvider();

    // ERC20 standard ABI for balanceOf
    const abi = ['function balanceOf(address owner) view returns (uint256)'];
    const contract = new ethers.Contract(tokenAddress, abi, provider);

    const balance = await contract.balanceOf(userAddress);
    return ethers.utils.formatUnits(balance, 18); // Assuming 18 decimals
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};
