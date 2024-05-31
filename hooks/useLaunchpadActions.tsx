import { use, useMemo, useState } from "react";
import {
  Address,
  Chain,
  createPublicClient,
  formatUnits,
  getContract,
  http,
  parseUnits,
  zeroAddress,
} from "viem";
import useWeb3Client from "./useWeb3Client";
import { preSaleAbi } from "@/contract-abi/preSaleAbi";
import { Token, WhitelistToken } from "@/types/Token";
import { erc20ABI, useAccount } from "wagmi";
import { toast } from "react-toastify";
import config from "@/config";
import { useAxios } from "./useAxios";
import dayjs from "dayjs";
import { useLaunchpadStore } from "@/store/launchpadStore";

const indexedChains = config.chains.reduce(
  (obj, chain) => ({ ...obj, [chain.id]: chain }),
  {} as Record<number, Chain>
);

const useLaunchpadActions = () => {
  const api = useAxios();
  const {
    blockchain,
    token: saleToken,
    sale_contract_address: saleAddress,
    whitelisted_tokens: whitelistedToken,
    ...launchpad
  } = useLaunchpadStore((s) => s.launchpad);

  const [isLoading, setIsLoading] = useState(false);

  const publicClient = useMemo(
    () =>
      createPublicClient({
        chain: indexedChains[blockchain.id],
        batch: { multicall: true },
        transport: http(),
      }),
    [blockchain]
  );
  const { address } = useAccount();
  const { walletClient } = useWeb3Client();

  const saleContract = useMemo(
    () =>
      getContract({
        abi: preSaleAbi,
        address: saleAddress,
        publicClient,
        walletClient: walletClient || undefined,
      }),
    [publicClient, saleAddress, walletClient]
  );

  const fetchTokenBalance = async (token: Token, address: Address) => {
    return await publicClient.readContract({
      abi: erc20ABI,
      address: token.contract_address,
      functionName: "balanceOf",
      args: [address],
    });
  };

  const fetchSoldAmount = async () => {
    const soldAmount = await saleContract.read.totalTokensSold();
    const formattedSoldAmount = +formatUnits(soldAmount, saleToken.decimals);

    useLaunchpadStore.setState({ totalTokensSold: formattedSoldAmount });
    return formattedSoldAmount;
  };

  const fetchTotalContributors = async () => {
    const totalContributors = await saleContract.read.getTotalContributors();
    useLaunchpadStore.setState({
      totalContributors: Number(totalContributors),
    });
    return Number(totalContributors);
  };

  const fetchContributorDetails = async () => {
    if (!address) return;
    const contributorDetails = await saleContract.read.contributorDetails([
      address,
    ]);

    const formattedContributorDetails = {
      amount: +formatUnits(contributorDetails[0], saleToken.decimals),
      isClaimed: contributorDetails[1],
      isRefunded: contributorDetails[2],
    };

    useLaunchpadStore.setState({
      contributorDetails: formattedContributorDetails,
    });

    return formattedContributorDetails;
  };

  const fetchTokenBalances = async () => {
    if (!address) return;
    const tokenBalances = await Promise.all(
      whitelistedToken.map(async (token) => {
        if (token.contract_address !== zeroAddress) {
          return await fetchTokenBalance(token, address);
        } else {
          return await publicClient.getBalance({ address });
        }
      })
    );

    const formattedBalances = tokenBalances.reduce(
      (obj, balance, index) => ({
        ...obj,
        [whitelistedToken[index].symbol]: +formatUnits(
          balance,
          whitelistedToken[index].decimals
        ),
      }),
      {} as Record<string, number>
    );

    useLaunchpadStore.setState({ balances: formattedBalances });

    return formattedBalances;
  };

  const fetchSaleStatus = async () => {
    const [isCancelled, isFinilized] = await Promise.all([
      saleContract.read.isCancelled(),
      saleContract.read.isFinalized(),
    ]);

    useLaunchpadStore.setState({
      saleStatus: { isCancelled, isFinilized },
    });

    return {
      isCancelled,
      isFinilized,
    };
  };

  const fetchAccountData = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      await Promise.all([fetchTokenBalances(), fetchContributorDetails()]);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetchIntialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchSoldAmount(),
        fetchTotalContributors(),
        fetchSaleStatus(),
      ]);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const checkAllowance = async (
    token: Address,
    spender: Address,
    amount: bigint
  ) => {
    if (!walletClient) return;

    const tokenContract = getContract({
      address: token,
      abi: erc20ABI,
      walletClient,
      publicClient,
    });

    const allowance = await tokenContract.read.allowance([
      walletClient.account.address,
      spender,
    ]);

    if (allowance < amount) {
      const hash = await tokenContract.write.approve([spender, amount]);

      await publicClient.waitForTransactionReceipt({ hash });
    }
  };

  const buyTokens = async (amount: number | string, token: WhitelistToken) => {
    let hash: `0x${string}` | undefined;

    if (!address || !walletClient || !amount) return { hash };

    const value = parseUnits(amount.toString(), token.decimals);

    setIsLoading(true);
    try {
      if (token.contract_address !== zeroAddress) {
        await checkAllowance(token.contract_address, saleAddress, value);
      }

      const { request } = await saleContract.simulate.buyToken(
        [token.contract_address, value],
        {
          value: token.contract_address !== zeroAddress ? 0n : value,
          account: address,
        }
      );

      hash = await walletClient.writeContract(request);

      await publicClient.waitForTransactionReceipt({ hash });

      const boughtAmount = +amount / token.price;
      toast.success(
        `You have successfully bought ${boughtAmount} ${saleToken.symbol} tokens`
      );

      api.post("/v1/launchpad-transaction/create", {
        transaction_hash: hash,
        blockchain_id: blockchain.id,
        bought_amount: boughtAmount,
        launchpad_id: launchpad.id,
        wallet_address: address,
      });
      fetchSoldAmount();
      fetchContributorDetails();
      fetchSaleStatus();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }

    setIsLoading(false);
    return { hash };
  };

  const withdrawEmergency = async () => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);
    try {
      const simulate =
        await saleContract.simulate.contributorEmergencyWithdrawal({
          account: address,
        });
      hash = await walletClient.writeContract(simulate.request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success(`You have successfully withdrawn your funds`);

      fetchSoldAmount();
      fetchContributorDetails();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }
    setIsLoading(false);

    return { hash };
  };

  const unlockTokens = async () => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);
    try {
      const simulate = await saleContract.simulate.claim({ account: address });
      hash = await walletClient.writeContract(simulate.request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success(`You have successfully unlocked your tokens`);

      fetchContributorDetails();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }
    setIsLoading(false);

    return { hash };
  };

  const finalize = async () => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);
    try {
      const { request } = await saleContract.simulate.finalize({
        account: address,
      });
      hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success(`You have successfully finalized the sale`);

      fetchSaleStatus();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }
    setIsLoading(false);

    return { hash };
  };

  const cancel = async () => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);
    try {
      const { request } = await saleContract.simulate.cancel({
        account: address,
      });
      hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success(`You have successfully cancelled the sale`);

      fetchSaleStatus();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }
    setIsLoading(false);

    return { hash };
  };

  const withdrawContribution = async () => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);
    try {
      const simulate = await saleContract.simulate.withdrawContribution({
        account: address,
      });
      hash = await walletClient.writeContract(simulate.request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success(`You have successfully withdrawn your funds`);

      fetchContributorDetails();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }
    setIsLoading(false);

    return { hash };
  };

  const withdrawCancelledTokens = async () => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);
    try {
      const simulate = await saleContract.simulate.withdrawCancelledTokens({
        account: address,
      });
      hash = await walletClient.writeContract(simulate.request);
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success(`You have successfully withdrawn canceled tokens`);

      fetchContributorDetails();
    } catch (e: any) {
      toast.error(e.walk?.()?.message || e?.message || "Something went wrong");
    }
    setIsLoading(false);

    return { hash };
  };

  const changeSaleTime = async (startTime: string, endTime: string) => {
    let hash: `0x${string}` | undefined;

    if (!walletClient) return { hash };

    setIsLoading(true);

    try {
      const { request } = await saleContract.simulate.setSalePeriodParams(
        [BigInt(dayjs(startTime).unix()), BigInt(dayjs(endTime).unix())],
        { account: address }
      );
      hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      await api.put(`/v1/launchpad/${saleAddress}`, {
        start_time: startTime,
        end_time: endTime,
      });
    } catch (e: any) {
      toast.error(
        e.walk?.()?.message ||
          e?.response?.data?.message ||
          e?.message ||
          "Something went wrong"
      );
    }

    setIsLoading(false);

    return { hash };
  };

  return {
    isLoading,
    cancel,
    finalize,
    buyTokens,
    unlockTokens,
    fetchIntialData,
    changeSaleTime,
    fetchSoldAmount,
    fetchAccountData,
    withdrawEmergency,
    fetchTokenBalance,
    withdrawContribution,
    fetchTotalContributors,
    fetchContributorDetails,
    withdrawCancelledTokens,
  };
};

export default useLaunchpadActions;
