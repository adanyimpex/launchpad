"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import useWeb3Client from "@/hooks/useWeb3Client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import config from "@/config";
import { preSaleFactoryAbi } from "@/contract-abi/preSaleFactoryAbi";
import {
  Address,
  decodeEventLog,
  getContract,
  parseEther,
  parseUnits,
  zeroAddress,
} from "viem";
import dayjs from "dayjs";
import { erc20ABI, useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Token, WhitelistToken } from "@/types/Token";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import useStore from "@/store";

const viewValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  } else if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a href={value} target="_blank">
        {value}
      </a>
    );
  } else return value;
};

export default function FormFinish({
  form,
  onBack,
}: {
  form: Record<string, any>;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { walletClient, publicClient, chain } = useWeb3Client();
  const { open } = useWeb3Modal();
  const { getCoinPrice } = useStore();
  const axios = useAxios();
  const router = useRouter();

  const payableTokens = useQuery<WhitelistToken[]>({
    queryKey: [`/v1/blockchain/${chain.id}/whitelisted-tokens`],
  });

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

      toast.success("Spend approve successfully");
    }
  };

  const storeLaunchpad = async (presaleAddress: Address) => {
    const ethPrice = getCoinPrice(chain.nativeCurrency.symbol);
    const displayed_token = payableTokens.data?.find(
      (item) => item.symbol === form.displayed_token
    )?.id;
    const selected_tokens = payableTokens.data
      ?.filter((item) => form.payable_tokens.indexOf(item.symbol) !== -1)
      .map((item) => ({
        token_id: item.id,
        price:
          item.symbol === chain.nativeCurrency.symbol && ethPrice
            ? (form.token_price / ethPrice).toFixed(12)
            : form.token_price,
      }));

    const tokenResponse = await axios.post<{ data: Token }>(
      "/v1/token/create",
      {
        chain_id: chain.id,
        name: form.name,
        symbol: form.symbol,
        contract_address: form.token_address,
        decimals: form.decimals,
      }
    );

    const payload = {
      chain_id: chain.id,
      token_id: tokenResponse.data.data.id,
      token_price: form.token_price,
      softcap: form.softcap,
      hardcap: form.hardcap,
      min_buy_amount: form.min_buy_amount,
      max_buy_amount: form.max_buy_amount,
      start_time: form.start_time,
      end_time: form.end_time,
      logo: form.logo,
      website: form.website,
      facebook: form.facebook,
      github: form.github,
      twitter: form.twitter,
      telegram: form.telegram,
      discord: form.discord,
      instagram: form.instagram,
      reddit: form.reddit,
      youtube: form.youtube,
      description: form.description,
      displayed_token,
      selected_tokens,
      contract_owner_address: address,
      sale_contract_address: presaleAddress,
    };

    await axios.post("/v1/launchpad/create", payload);
  };

  const onSubmit = async () => {
    if (!payableTokens.data) return;
    if (!walletClient) return open();

    setLoading(true);

    try {
      const ethPrice = getCoinPrice(chain.nativeCurrency.symbol);
      const totalSupply = parseUnits(`${form.hardcap}`, form.decimals);

      const rate = ethPrice
        ? parseEther((form.token_price / ethPrice).toFixed(12))
        : parseEther(`${form.token_price}`);

      await checkAllowance(
        form.token_address,
        config.preSaleFactory[chain.id],
        totalSupply
      );

      const whitelistedTokens = payableTokens.data.filter(
        (item) =>
          form.payable_tokens.indexOf(item.symbol) !== -1 &&
          item.contract_address !== zeroAddress
      );

      const tokenAddresses = whitelistedTokens.map(
        (item) => item.contract_address
      );

      const tokenPrices = whitelistedTokens.map((item) =>
        parseUnits(`${form.token_price}`, item.decimals)
      );

      const { request } = await publicClient.simulateContract({
        address: config.preSaleFactory[chain.id],
        abi: preSaleFactoryAbi,
        functionName: "createPreSale",
        args: [
          rate,
          form.token_address,
          totalSupply,
          parseUnits(`${form.min_buy_amount}`, form.decimals),
          parseUnits(`${form.max_buy_amount}`, form.decimals),
          BigInt(dayjs(form.start_time).unix()),
          BigInt(dayjs(form.end_time).unix()),
          tokenAddresses,
          tokenPrices,
        ],
        value: parseEther(`${config.launchpadFee[chain.id].creation}`),
        account: walletClient.account,
      });

      const hash = await walletClient.writeContract(request);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      const logs = receipt.logs.filter(
        (log) =>
          log.address.toLowerCase() ===
          config.preSaleFactory[chain.id].toLowerCase()
      );

      const { preSaleAddress } = decodeEventLog({
        abi: preSaleFactoryAbi,
        eventName: "PreSaleCreated",
        topics: logs[0].topics,
        data: logs[0].data,
        strict: false,
      }).args;

      if (preSaleAddress) {
        try {
          await storeLaunchpad(preSaleAddress);
          toast.success("Create launchpad successfully");
          router.push(`/launchpads/${preSaleAddress}`);
        } catch (error) {
          toast.error(
            "something went wrong while storing launchpad data, please contact with admin!"
          );
        }
      } else {
        toast.error("Something went wrong, cannot get presale address");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.walk?.()?.message || error.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl w-full mx-auto">
      <h1 className="mb-4 text-2xl font-semibold">Finish</h1>
      <h4 className="mb-6 max-w-md">Review your information</h4>
      <Card>
        <CardContent>
          <table className="w-full table-auto text-sm mb-12">
            <tbody className="divide-y">
              {form &&
                Object.entries(form)
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td className="capitalize py-3 px-3 ">
                        {key.replaceAll("_", " ")}
                      </td>
                      <td className="text-primary py-3 px-3 font-medium break-all text-right">
                        {viewValue(value)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div className="flex gap-4 justify-center">
            <Button type="button" variant={"secondary"} onClick={onBack}>
              Back
            </Button>
            <Button
              disabled={loading}
              className="items-center"
              onClick={onSubmit}
            >
              {loading && <Loader2Icon className="animate-spin mr-2 h-5 w-5" />}
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
