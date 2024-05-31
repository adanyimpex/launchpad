import config, { tokenCreationPrices } from "@/config";
import { tokenContracts } from "@/config/token-creation";
import TokenType from "@/types/TokenType";
import {
  Account,
  Chain,
  DeployContractParameters,
  isAddress,
  parseEther,
  parseUnits,
} from "viem";
import { WalletClient } from "wagmi";
import { z } from "zod";

export const useCommonToken = () => {
  const schema = z.object({
    name: z.string().min(0, "Name is required"),
    symbol: z.string().min(0, "Symbol is required"),
    decimals: z.coerce.number().int().min(6).max(18),
    total_supply: z.coerce.number().int().positive(),
  });

  const deployParams = async (
    values: z.infer<typeof schema>,
    walletClient: WalletClient,
    tokenType?: ValueOf<typeof TokenType>
  ) => {
    const { abi, bytecode } =
      await tokenContracts[
        (tokenType || TokenType.BasicToken) as typeof TokenType.BasicToken
      ]();

    const feeService =
      tokenCreationPrices[tokenType || TokenType.BasicToken][
        walletClient.chain.id
      ];

    const deployContractParams: DeployContractParameters<
      typeof abi,
      Chain,
      Account
    > = {
      account: walletClient.account,
      abi,
      args: [
        values.name,
        values.symbol,
        values.decimals,
        parseUnits(`${values.total_supply}`, values.decimals || 18),
        config.serviceReceiver,
        parseEther(`${feeService}`),
      ],
      bytecode,
      value: parseEther(`${feeService}`),
    };

    return deployContractParams;
  };

  return { schema, deployParams };
};

export const useTaxToken = () => {
  const schema = z.object({
    name: z.string().min(0, "Name is required"),
    symbol: z.string().min(0, "Symbol is required"),
    decimals: z.coerce.number().int().min(6).max(18),
    total_supply: z.coerce.number().int().positive(),

    max_supply: z.coerce.number().int().positive(),
    max_transaction_amount: z.coerce.number().int().positive(),
    router: z.string().refine(isAddress, "Router is invalid address"),
    team_wallet: z.string().refine(isAddress, "Team wallet is invalid address"),
  });

  const deployParams = async (
    values: z.infer<typeof schema>,
    walletClient: WalletClient
  ) => {
    const { abi, bytecode } = await tokenContracts[TokenType.TaxToken]();

    const feeService =
      tokenCreationPrices[TokenType.TaxToken][walletClient.chain.id];

    const deployContractParams: DeployContractParameters<
      typeof abi,
      Chain,
      Account
    > = {
      account: walletClient.account,
      abi,
      args: [
        values.name,
        values.symbol,
        values.decimals,
        parseUnits(`${values.total_supply}`, values.decimals),
        parseUnits(`${values.max_supply}`, values.decimals),
        parseUnits(`${values.max_transaction_amount}`, values.decimals),
        values.router as `0x${string}`,
        values.team_wallet as `0x${string}`,
        config.serviceReceiver,
        parseEther(`${feeService}`),
      ],
      bytecode,
      value: parseEther(`${feeService}`),
    };

    return deployContractParams;
  };

  return { schema, deployParams };
};
