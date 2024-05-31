"use client";

import { Card, CardContent } from "../ui/card";
import dayjs from "dayjs";
import { useMemo } from "react";
import ClientOnly from "../ClientOnly";
import { useLaunchpadStore } from "@/store/launchpadStore";

export default function SaleInfo() {
  const {
    totalTokensSold,
    totalContributors,
    contributorDetails,
    launchpad,
    computed: { status },
  } = useLaunchpadStore();

  // calculate time percentage from start time to end time using dayjs
  const timePercentage = useMemo(() => {
    const startTime = dayjs(launchpad.start_time);
    const endTime = dayjs(launchpad.end_time);
    const now = dayjs();

    if (now.isBefore(startTime)) {
      return 0;
    } else if (now.isAfter(endTime)) {
      return 100;
    } else {
      return Math.round(
        ((now.unix() - startTime.unix()) /
          (endTime.unix() - startTime.unix())) *
          100
      );
    }
  }, [launchpad]);

  return (
    <Card>
      <CardContent>
        <ClientOnly>
          {dayjs().isAfter(dayjs(launchpad.start_time)) && (
            <div
              className="relative h-4 bg-gradient-to-r from-[#A3BEFF] to-primary w-full mb-6"
              style={{
                width: `${timePercentage}%`,
              }}
            >
              <div className="absolute -top-2 left-0 h-8 w-1.5 bg-[#A3BEFF] rounded-lg"></div>
              {timePercentage >= 5 && (
                <div className="bg-[#3364D6] border-2 border-white rounded-full h-6 w-6 absolute -right-2 -top-1"></div>
              )}
            </div>
          )}
        </ClientOnly>
        <table className="w-full table-auto text-sm">
          <tbody className="divide-y">
            <tr>
              <td className="py-3 px-3">Status</td>
              <td className="py-3 px-3 break-all capitalize text-right text-primary">
                {status}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3">Unsold token</td>
              <td className="py-3 px-3 break-all text-right">
                {(launchpad.hardcap - totalTokensSold).toLocaleString()}{" "}
                {launchpad.token.symbol}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3">Sale type</td>
              <td className="py-3 px-3 break-all text-right text-primary">
                Public
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3">Minimum Buy</td>
              <td className="py-3 px-3 break-all text-right">
                {launchpad.min_buy_amount} {launchpad.token.symbol}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3">Maximum Buy</td>
              <td className="py-3 px-3 break-all text-right">
                {launchpad.max_buy_amount.toLocaleString()}{" "}
                {launchpad.token.symbol}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3">Total Contributors</td>
              <td className="py-3 px-3 break-all text-right">
                {totalContributors}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3">You purchased</td>
              <td className="py-3 px-3 break-all text-right">
                {contributorDetails.amount.toLocaleString()}{" "}
                {launchpad.token.symbol}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
