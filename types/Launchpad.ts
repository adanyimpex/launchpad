import { Address } from "viem";
import { Blockchain } from "./Blockchain";
import { Token, WhitelistToken } from "./Token";

export interface Launchpad {
  id: number;
  chain_id: number;
  token_id: number;
  affiliate_status: string;
  token_price: string;
  softcap: number;
  hardcap: number;
  min_buy_amount: number;
  max_buy_amount: number;
  start_time: string;
  end_time: string;
  logo: string;
  website: string;
  facebook?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  instagram?: string;
  reddit?: string;
  youtube?: string;
  description?: string;
  sale_contract_address: Address;
  contract_owner_address: Address;
  created_at: string;
  updated_at: string;
  displayed_token: number;
  blockchain: Blockchain;
  token: Token;
  totalTokensSold?: number;
  whitelisted_tokens: WhitelistToken[];
}
