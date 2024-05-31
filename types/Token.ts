import { Address } from "viem";
import { Blockchain } from "./Blockchain";

export type Token = {
  id?: number;
  name: string;
  symbol: string;
  contract_address: Address;
  decimals: number;
};

export type GeneratedToken = Token & {
  chain_id: number;
  created_at: string;
  transaction_hash: string;
};

export type WhitelistToken = Token & {
  id: number;
  chain_id: number;
  image?: string | null;
  status?: string;
  transaction_hash?: string;
  price: number;
};

export type TokenOnDepolyType = Token & {
  transaction_hash: string;
  total_supply: number;
};
