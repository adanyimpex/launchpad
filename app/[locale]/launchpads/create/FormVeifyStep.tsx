/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import TextField from "@/components/form/TextField";
import CheckboxGroupField from "@/components/form/CheckboxGroupField";
import RadioGroupField from "@/components/form/RadioGroupField";
import { useDebounce } from "react-use";
import useWeb3Client from "@/hooks/useWeb3Client";
import { erc20ABI, useAccount, useNetwork } from "wagmi";
import { Address, getContract, isAddress } from "viem";
import useWeb3Query from "@/hooks/useWeb3Query";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import config from "@/config";
import { useQuery } from "@tanstack/react-query";
import LoadingBlock from "@/components/LoadingBlock";
import { useEffect, useMemo, useState } from "react";
import { WhitelistToken } from "@/types/Token";
import { useCreateLaunchpadStore } from "@/store/createLaunchpadStore";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const formSchema = z
  .object({
    token_address: z
      .string()
      .min(0, {
        message: "Token address is required",
      })
      .refine((val) => isAddress(val), {
        message: "Invalid token address",
      }),
    payable_tokens: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    displayed_token: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number().int().positive(),
  })
  .refine((data) => data.payable_tokens.includes(data.displayed_token), {
    message: "Displayed token must be in payable tokens",
    path: ["displayed_token"],
  });

type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
};

export type FormVerifyStepType = z.infer<typeof formSchema>;

const TokenAbi = [
  ...erc20ABI,
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function FormVerifyStep({
  onSubmit = () => {},
  className,
}: React.HTMLAttributes<HTMLDivElement> & {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
}) {
  const { open } = useWeb3Modal();
  const { chain: currentChain } = useNetwork();
  const { publicClient, chain } = useWeb3Client();
  const { address } = useAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      token_address: "",
      payable_tokens: [],
    },
  });

  const { data: whitelistedTokens, isLoading } = useQuery<WhitelistToken[]>({
    queryKey: [`/v1/blockchain/${chain.id}/whitelisted-tokens`],
  });

  const [displayedTokens, setDisplayedTokens] = useState<string[]>([]);

  useEffect(() => {
    if (whitelistedTokens?.length) {
      form.setValue("payable_tokens", [whitelistedTokens[0].symbol]);
      form.setValue("displayed_token", whitelistedTokens[0].symbol);
      setDisplayedTokens([whitelistedTokens[0].symbol]);
    }
  }, [whitelistedTokens]);

  const payabelTokens = useMemo(
    () => whitelistedTokens?.map((item) => item.symbol) || [],
    [whitelistedTokens]
  );
  const launchpadFee = config.launchpadFee[chain.id];

  const tokenInfoRequest = async () => {
    const tokenAddress = form.getValues("token_address") as Address;

    if (!tokenAddress || !isAddress(tokenAddress)) return;

    const tokenContract = getContract({
      address: tokenAddress,
      abi: TokenAbi,
      publicClient,
    });

    const [name, symbol, decimals] = await Promise.all([
      tokenContract.read.name(),
      tokenContract.read.symbol(),
      tokenContract.read.decimals(),
    ]);

    // if (owner.toLowerCase() !== address?.toLowerCase()) {
    //   throw new Error("You are not the owner of this token");
    // }

    form.setValue("name", name);
    form.setValue("symbol", symbol);
    form.setValue("decimals", decimals);

    useCreateLaunchpadStore.setState({
      token: {
        address: tokenAddress,
        decimals,
        name,
        symbol,
      },
    });

    return { name, symbol, decimals };
  };

  const tokenInfo = useWeb3Query<TokenInfo | undefined>(tokenInfoRequest);

  useDebounce(tokenInfo.fetch, 500, [form.getValues("token_address")]);

  if (isLoading) return <LoadingBlock />;

  return (
    <div className={cn("max-w-6xl w-full mx-auto", className)}>
      <h1 className="mb-4 text-2xl font-semibold">Verify Token</h1>
      <h4 className="mb-6">
        In order to setup your token sale, you first need to verify the
        ownership of the token.
      </h4>
      <div className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
        <svg
          className="flex-shrink-0 inline w-4 h-4 mr-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <p>
          <span className="font-medium">Pinky:</span> Currently you can list
          only BSC, Ethereum, Polygon, Fantom, Avalanche, Goerli, BSC Testnet
          tokens for sale!
        </p>
      </div>
      {currentChain?.unsupported && (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-800/30 dark:text-red-400">
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <p>
            You are running on unsupported network. please{" "}
            <button
              onClick={() => open({ view: "Networks" })}
              type="button"
              className="font-semibold underline hover:no-underline"
            >
              Switch Network
            </button>
          </p>
        </div>
      )}
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1 text-sm text-muted-foreground font-medium">
                    Launchpad fees:
                    <span className="text-primary">
                      {launchpadFee.creation} {chain.nativeCurrency.symbol}{" "}
                      creation + {launchpadFee.service}% of total raised amount
                    </span>
                  </div>
                </div>
                <p className="text-destructive text-sm">
                  (*) is required field
                </p>
              </div>
              <div className="space-y-3">
                <TextField
                  control={form.control}
                  name="token_address"
                  className="flex-1"
                  input={{
                    placeholder: "Ex: CryptoUNO",
                    required: true,
                  }}
                />
                <div className="space-y-2">
                  {tokenInfo.loading && (
                    <Loader2Icon className="animate-spin " />
                  )}
                  {tokenInfo.error && (
                    <p className="text-destructive text-sm">
                      {tokenInfo.error}
                    </p>
                  )}
                  <div className="flex flex-col divide-y text-sm font-medium">
                    {tokenInfo.data &&
                      Object.entries(tokenInfo.data).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex py-2 justify-between gap-2"
                        >
                          <span className="capitalize">{key}</span>
                          <span className="text-primary">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <CheckboxGroupField
                control={form.control}
                name="payable_tokens"
                values={payabelTokens}
                onChange={(values) => {
                  setDisplayedTokens(values as string[]);
                }}
              />

              {displayedTokens.length > 0 && (
                <RadioGroupField
                  control={form.control}
                  name="displayed_token"
                  values={displayedTokens}
                />
              )}

              {/* <RadioGroupField
                control={form.control}
                name="affiliate_program"
                values={[
                  {
                    value: false as any,
                    label: "Disable Affiliate",
                  },
                  {
                    value: true as any,
                    label: "Enable Affiliate",
                  },
                ]}
              /> */}

              {/* <div className="bg-muted text-muted-foreground py-2 px-4 text-sm">
                <p className="text-center">
                  For auto listing, after you finalize the pool your token will
                  be auto listed on DEX.
                </p>
              </div> */}
              <div className="flex justify-center">
                <Button type="submit" disabled={!form.formState.isValid}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
