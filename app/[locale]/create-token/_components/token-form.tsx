"use client";

import TokenType from "@/types/TokenType";
import { TokenOnDepolyType } from "@/types/Token";
import DynamicTokenForm from "./dynamic-token-form";
import { useCommonToken, useTaxToken } from "@/hooks/useTokenSchema";
import { WalletClient } from "wagmi";
import { Abi, Account, Chain, DeployContractParameters } from "viem";
import useWeb3Client from "@/hooks/useWeb3Client";
import { toast } from "react-toastify";

type Props = {
  tokenType: ValueOf<typeof TokenType>;
  onDeploy: (values: TokenOnDepolyType) => Promise<void>;
};

type CreateTokenType = {
  name: string;
  symbol: string;
  decimals?: number;
  total_supply: number;
};

export default function TokenForm({ tokenType, onDeploy }: Props) {
  const { walletClient, publicClient } = useWeb3Client();
  const commonToken = useCommonToken();
  const taxToken = useTaxToken();

  async function onSubmit<T>(
    values: T & CreateTokenType,
    getDeployParams: (
      values: T,
      walletClient: WalletClient,
      tokenType?: ValueOf<typeof TokenType>
    ) => Promise<DeployContractParameters<Abi, Chain, Account>>
  ) {
    if (!walletClient) return;

    try {
      const deployParams = await getDeployParams(
        values,
        walletClient,
        tokenType
      );

      const hash = await walletClient.deployContract(deployParams);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt?.contractAddress) {
        onDeploy({
          name: values.name,
          symbol: values.symbol,
          decimals: values?.decimals || 18,
          total_supply: values.total_supply,
          contract_address: receipt.contractAddress,
          transaction_hash: receipt.transactionHash,
        });
      }
    } catch (error: any) {
      toast.error(
        error.walk?.()?.message || error?.message || "Something went wrong"
      );
    }
  }

  switch (tokenType) {
    case TokenType.TaxToken:
      return (
        <DynamicTokenForm
          key={TokenType.TaxToken}
          schema={taxToken.schema}
          onSubmit={(values) => onSubmit(values, taxToken.deployParams)}
        />
      );
    default:
      return (
        <DynamicTokenForm
          key={TokenType.BasicToken}
          schema={commonToken.schema}
          onSubmit={(values) => onSubmit(values, commonToken.deployParams)}
        />
      );
  }
}
