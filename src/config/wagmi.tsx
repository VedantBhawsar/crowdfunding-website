import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit';
import { mainnet } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

const customMainnet = {
  ...mainnet,
  rpcUrl:
    process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL ||
    `https://eth-mainnet.g.alchemy.com/v2/${
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'SJqVZ2UR7aN6Egap0f-eIj4ME4iMe_k6'
    }`,
};

export const networks = [customMainnet];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
