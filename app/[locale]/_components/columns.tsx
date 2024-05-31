"use client";

import ClientOnly from "@/components/ClientOnly";
import { Button } from "@/components/ui/button";
import { TooltipContainer } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Launchpad } from "@/types/Launchpad";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import Countdown from "react-countdown";

export const columns: ColumnDef<Launchpad>[] = [
  {
    accessorKey: "token",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/launchpads/${row.original.sale_contract_address}`}
        className="flex items-center gap-2"
      >
        <TooltipContainer title={row.original.blockchain.name}>
          <img
            src={row.original.blockchain.image}
            alt="avatar"
            className="object-contain h-6 w-6"
          />
        </TooltipContainer>
        <span>{row.original.token.symbol}</span>
      </Link>
    ),
  },
  {
    accessorKey: "softcap",
    header: "Softcap",
    accessorFn: (row) => row.softcap.toLocaleString(),
  },
  {
    accessorKey: "hardcap",
    header: "Hardcap",
    accessorFn: (row) => row.hardcap.toLocaleString(),
  },
  {
    accessorKey: "whitelisted_tokens",
    header: "WT",
    accessorFn: (row) =>
      row.whitelisted_tokens.map((token) => token.symbol).join(", "),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;

      const softSoldPercentage =
        ((item.totalTokensSold || 0) / item.softcap) * 100;

      const hardSoldPercentage =
        ((item.totalTokensSold || 0) / item.hardcap) * 100;

      return (
        <div className="relative flex items-center text-xs justify-center overflow-hidden h-5 bg-[#DDE5EF] rounded-full w-48 mb-1">
          <div
            className={cn(
              "absolute inset-0",
              item.softcap === item.hardcap ? "bg-green-600" : "bg-green-600/50"
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
          {dayjs().isAfter(dayjs(item.start_time)) ? (
            <p className="text-black">
              {item.totalTokensSold}/{item.softcap}
            </p>
          ) : (
            <p className="text-yellow-600">Upcomming</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "start_time",
    header: "Sale start in",
    cell: ({ row }) => (
      <ClientOnly>
        <Countdown date={dayjs(row.original.start_time).valueOf()} />
      </ClientOnly>
    ),
  },
  {
    accessorKey: "end_time",
    header: "Sale end in",
    cell: ({ row }) => (
      <ClientOnly>
        <Countdown date={dayjs(row.original.end_time).valueOf()} />
      </ClientOnly>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button asChild size={"sm"} variant={"ghost"}>
          <Link href={`/launchpads/${row.original.sale_contract_address}`}>
            View
          </Link>
        </Button>
      </div>
    ),
  },
];
