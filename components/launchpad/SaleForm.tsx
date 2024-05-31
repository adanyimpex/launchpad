/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useWeb3Client from "@/hooks/useWeb3Client";
import { Card, CardContent } from "../ui/card";
import SaleCountdown from "./SaleCountdown";
import { WhitelistToken } from "@/types/Token";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import useLaunchpadActions from "@/hooks/useLaunchpadActions";
import ClientOnly from "../ClientOnly";
import LoadingBlock from "../LoadingBlock";
import SwitchNetworkButton from "./SwitchNetworkButton";
import ConfirmDailog from "../ConfirmDialog";
import { useLaunchpadStore } from "@/store/launchpadStore";

export default function SaleForm({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const {
    launchpad,
    totalTokensSold,
    balances,
    contributorDetails,
    computed: { status },
  } = useLaunchpadStore();

  const { open } = useWeb3Modal();

  const { chain } = useWeb3Client();

  const { isConnected, address } = useAccount();

  const [amount, setAmount] = useState<number | string>("");

  const [selectedToken, setSelectedToken] = useState<WhitelistToken>(
    launchpad.whitelisted_tokens[0]
  );

  const {
    isLoading,
    buyTokens,
    unlockTokens,
    fetchAccountData,
    withdrawEmergency,
    fetchIntialData,
  } = useLaunchpadActions();

  const softSoldPercentage = useMemo(
    () => (totalTokensSold / launchpad.softcap) * 100,
    [totalTokensSold, launchpad]
  );

  const hardSoldPercentage = useMemo(
    () => (totalTokensSold / launchpad.hardcap) * 100,
    [totalTokensSold, launchpad]
  );

  const displayedToken = useMemo(
    () =>
      launchpad.whitelisted_tokens.find(
        (token) => launchpad.displayed_token === token.id
      ) || launchpad.whitelisted_tokens[0],
    [launchpad]
  );

  const selecteToken = (token: WhitelistToken) => {
    setSelectedToken(token);
    setAmount("");
  };

  useEffect(() => {
    fetchAccountData();
  }, [address]);

  useEffect(() => {
    fetchIntialData();
  }, []);

  const setMax = () => {
    const balance = balances[selectedToken.symbol] || 0;
    setAmount(
      balance > launchpad.max_buy_amount * selectedToken.price
        ? launchpad.max_buy_amount * selectedToken.price
        : balance
    );
  };

  const RenderActionButton = () => {
    if (!isConnected) {
      return (
        <Button className="mt-6 w-full" onClick={() => open()}>
          Connect Wallet
        </Button>
      );
    } else if (chain.id !== launchpad.blockchain.id) {
      return (
        <SwitchNetworkButton
          className="mt-6 w-full"
          chainId={launchpad.blockchain.id}
        />
      );
    } else if (status === "canceled") {
      if (!contributorDetails.isRefunded && contributorDetails.amount > 0) {
        <Button
          className="mt-6 w-full"
          onClick={() => buyTokens(amount, selectedToken)}
          disabled={isLoading}
        >
          Withdraw contribution
        </Button>;
      }
    } else if (status === "ended") {
      if (contributorDetails.amount > 0) {
        return (
          <Button
            className="mt-6 w-full"
            onClick={() => unlockTokens()}
            disabled={isLoading || contributorDetails.isClaimed}
          >
            {contributorDetails.isClaimed ? "Claimed" : "Claim"} (
            {contributorDetails.amount.toLocaleString()}{" "}
            {launchpad.token.symbol})
          </Button>
        );
      }
    } else {
      return (
        <>
          <Button
            className="mt-6 w-full"
            onClick={() => buyTokens(amount, selectedToken)}
            disabled={
              isLoading || ["filled", "canceled", "upcoming"].includes(status)
            }
          >
            Buy with {selectedToken.symbol}
          </Button>
          {status === "live" && contributorDetails.amount > 0 && (
            <ConfirmDailog
              title="Confirm Emergency Withdraw"
              content={
                <p className="text-destructive text-sm font-medium">
                  Emergency withdrawal takes your contribution (with 10%
                  penalty) out of Presale Pool and cancels your participation in
                  the presale
                </p>
              }
              triggerButton={
                <Button
                  className="mt-3 w-full"
                  disabled={isLoading}
                  variant={"outline"}
                >
                  Emergency Withdraw
                </Button>
              }
              confirmButton={{
                onClick: () => withdrawEmergency(),
              }}
            />
          )}
        </>
      );
    }
  };

  const cardTitle = () => {
    switch (status) {
      case "live":
        return "Presale ends in";
      case "upcoming":
        return "Presale starts in";
      case "filled":
        return "Presale ends in";
      case "ended":
        return "Presale ended";
      default:
        return "Presale canceled";
    }
  };

  return (
    <Card
      className={cn(
        "relative shadow-orange border-4 border-[#FFA14A]",
        { "overflow-hidden": isLoading },
        className
      )}
    >
      {isLoading && <LoadingBlock absolute />}
      <CardContent className="!pt-12">
        <div className="bg-gradient-to-b from-[#FFA14A] whitespace-nowrap rounded-lg to-[#FF881A] text-white font-semibold text-xl absolute -top-6 py-2 px-6 -translate-x-1/2 left-1/2">
          {cardTitle()}
        </div>

        {["upcoming", "live", "filled"].includes(status) && (
          <SaleCountdown
            date={dayjs(
              status === "upcoming" ? launchpad.start_time : launchpad.end_time
            ).valueOf()}
            className="mb-6"
          />
        )}

        <div className="mb-6">
          <p className="font-medium mb-3">
            Progress ({softSoldPercentage.toLocaleString()}%)
          </p>
          <div className="relative overflow-hidden h-3 bg-[#DDE5EF] rounded-full w-full mb-3">
            <div
              className={cn(
                "absolute inset-0",
                launchpad.softcap === launchpad.hardcap
                  ? "bg-green-600"
                  : "bg-green-600/50"
              )}
              style={{
                width:
                  (softSoldPercentage >= 100 ? 100 : softSoldPercentage) + "%",
              }}
            ></div>
            {launchpad.softcap !== launchpad.hardcap && (
              <div
                className="absolute z-10 inset-0 bg-green-600"
                style={{
                  width:
                    (softSoldPercentage > 100 ? hardSoldPercentage : 0) + "%",
                }}
              ></div>
            )}
          </div>
          <div className="flex text-xs font-semibold text-[#94A3B8] justify-between">
            <span>
              {(totalTokensSold * displayedToken.price).toLocaleString()}{" "}
              {displayedToken.symbol}
            </span>
            <span>
              {launchpad.hardcap * displayedToken.price} {displayedToken.symbol}
            </span>
          </div>
        </div>
        {!["ended", "canceled"].includes(status) && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {launchpad.whitelisted_tokens.map((token) => (
                <button
                  key={token.id}
                  className={cn(
                    "bg-white font-medium border-[#CBD5E1] border-2 rounded-lg py-2 px-3 flex justify-center items-center dark:bg-background dark:border-[#73787f]",
                    {
                      "text-primary border-primary dark:border-primary":
                        selectedToken.symbol === token.symbol,
                    }
                  )}
                  type="button"
                  onClick={() => selecteToken(token)}
                >
                  {token.image && (
                    <img
                      src={token.image}
                      alt={token.symbol}
                      className="h-5 w-5 object-contain mr-2"
                    />
                  )}
                  {token.symbol}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>
                Amount (min:{" "}
                {Intl.NumberFormat("en", {
                  maximumSignificantDigits: 2,
                }).format(launchpad.min_buy_amount * selectedToken.price)}{" "}
                {selectedToken.symbol})
              </Label>
              <div className="relative">
                <Input
                  placeholder="0.0"
                  step={0.001}
                  type="number"
                  className="pr-14"
                  value={amount}
                  min={launchpad.min_buy_amount * selectedToken.price}
                  max={launchpad.max_buy_amount * selectedToken.price}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  className="text-primary text-sm font-semibold absolute right-0 px-4 hover:opacity-75 h-full top-0"
                  onClick={() => setMax()}
                >
                  MAX
                </button>
              </div>
              {!!amount && (
                <p className="text-xs text-green-600">
                  You will get{" "}
                  {(+amount / selectedToken.price).toLocaleString()}{" "}
                  {launchpad.token.symbol}{" "}
                </p>
              )}
            </div>
          </>
        )}
        {status === "canceled" && (
          <p className="text-center">This pool has canceled</p>
        )}
        <ClientOnly>
          <RenderActionButton />
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
