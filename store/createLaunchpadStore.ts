import { create } from "zustand";

interface createLaunchpadStoreState {
  coinPrice: Record<string, number>;
  token?: {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
  };
}

const useCreateLaunchpadStore = create<createLaunchpadStoreState>(() => ({
  coinPrice: {},
}));

export { useCreateLaunchpadStore };
