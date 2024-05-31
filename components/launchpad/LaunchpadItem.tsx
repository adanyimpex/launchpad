"use client";

import { Card, CardContent, CardFooter } from "../ui/card";
import { BellRingIcon, HeartIcon } from "lucide-react";
import { Button } from "../ui/button";
import StatusBadge from "./StatusBadge";
import Countdown from "react-countdown";
import Link from "next/link";
import { Launchpad } from "@/types/Launchpad";
import { useMemo } from "react";
import dayjs from "dayjs";
import ClientOnly from "../ClientOnly";
import { cn } from "@/lib/utils";
import { TooltipContainer } from "../ui/tooltip";

export default function LaunchpadItem({ item }: { item: Launchpad }) {
  const displayedToken = useMemo(
    () =>
      item.whitelisted_tokens.find(
        (token) => item.displayed_token === token.id
      ) || item.whitelisted_tokens[0],
    [item]
  );

  const isStarted = useMemo(
    () => dayjs().isAfter(dayjs(item.start_time)),
    [item]
  );

  const status = useMemo(() => {
    if (isStarted) {
      if (dayjs().isAfter(dayjs(item.end_time))) {
        return "ended";
      } else {
        return "live";
      }
    } else {
      return "upcoming";
    }
  }, [isStarted, item]);

  const softSoldPercentage = useMemo(
    () => ((item.totalTokensSold || 0) / item.softcap) * 100,
    [item]
  );

  const hardSoldPercentage = useMemo(
    () => ((item.totalTokensSold || 0) / item.hardcap) * 100,
    [item]
  );

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <div className="flex items-center gap-4">
          <img
            src={item.logo || "/images/avatar.png"}
            alt="avatar"
            className="object-cover rounded-full h-12 w-12"
          />
          <div className="flex flex-col flex-1">
            <div className="flex items-center w-full justify-between gap-2">
              <p className="font-semibold text-lg truncate">
                {item.token.name}
              </p>
              <TooltipContainer title={item.blockchain.name}>
                <img
                  src={item.blockchain.image}
                  alt={item.blockchain.name}
                  className="w-6 h-6 object-contain"
                />
              </TooltipContainer>
            </div>
            <p className="text-sm font-medium text-[#94A3B8]">
              1 {item.token.symbol} ={" "}
              {Number(displayedToken?.price)?.toLocaleString()}{" "}
              {displayedToken.symbol}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
          <StatusBadge type={status} />

          <Button className="w-28" asChild>
            <Link href={`/launchpads/${item.sale_contract_address}`}>View</Link>
          </Button>
        </div>
        <div className="mt-6">
          <p className="font-medium mb-2.5">Soft/Hard</p>
          <p className="text-primary text-sm font-semibold mb-5">
            {item.softcap} {item.token.symbol} / {item.hardcap}{" "}
            {item.token.symbol}
          </p>
          <p className="font-medium mb-3">
            Progress ({softSoldPercentage.toLocaleString()}%)
          </p>
          <div className="relative overflow-hidden h-3 bg-[#DDE5EF] rounded-full w-full mb-1">
            <div
              className={cn(
                "absolute inset-0",
                item.softcap === item.hardcap
                  ? "bg-green-600"
                  : "bg-green-600/50"
              )}
              style={{
                width:
                  (softSoldPercentage >= 100 ? 100 : softSoldPercentage) + "%",
              }}
            ></div>
            {item.softcap !== item.hardcap && (
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
              {(item.totalTokensSold || 0) * displayedToken.price}{" "}
              {displayedToken.symbol}
            </span>
            <span>
              {item.hardcap * displayedToken.price} {displayedToken.symbol}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-[#CBD5E1]/20 dark:bg-black/20 py-3 px-6 rounded-xl justify-between gap-4">
        <ClientOnly>
          <div className="flex flex-col gap-2 ">
            {dayjs().isBefore(dayjs(item.end_time)) && (
              <>
                <span className="text-sm font-medium">
                  {isStarted ? "Sale Ends in:" : "Sale Starts in:"}
                </span>
                <span className="text-lg font-medium">
                  <Countdown
                    date={dayjs(
                      isStarted ? item.end_time : item.start_time
                    ).valueOf()}
                  />
                </span>
              </>
            )}
          </div>
        </ClientOnly>
        <div className="flex items-center">
          <Button variant={"ghost"} size={"icon"}>
            <HeartIcon className="h-5 w-5" />
          </Button>
          <Button variant={"ghost"} size={"icon"}>
            <BellRingIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
