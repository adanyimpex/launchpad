import { create } from "zustand";

export type StoreType = {
  coinsPrice: Record<string, number>;
  getCoinPrice: (symbol: string) => number;
};

const initialState: StoreType = {
  coinsPrice: {},
  getCoinPrice: () => 1,
};

const useStore = create<StoreType>((set, get) => ({
  ...initialState,
  getCoinPrice: (symbol: string) => get().coinsPrice[symbol] || 1,
}));

export default useStore;
