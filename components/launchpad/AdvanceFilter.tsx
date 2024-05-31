/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import config from "@/config";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { Chain } from "viem";
import { useNetwork } from "wagmi";

const tabs = [
  {
    value: "all",
    title: "All launchpads",
  },
  {
    value: "advanced",
    title: "Advanced Mode",
  },
  // {
  //   value: "my-contributions",
  //   title: "My Contributions",
  // },
];

const filterByOptions = [
  {
    value: "",
    title: "All Status",
  },
  {
    value: "upcoming",
    title: "Upcoming",
  },
  {
    value: "live",
    title: "Live",
  },
  {
    value: "ended",
    title: "Ended",
  },
  //   {
  //     value: "cancelled",
  //     title: "Cancelled",
  //   },
];

const sortByOptions = [
  {
    value: "",
    title: "No Sort",
  },
  {
    value: "hardcap",
    title: "Hardcap",
  },
  {
    value: "softcap",
    title: "Softcap",
  },
  {
    value: "start_time",
    title: "Start Time",
  },
  {
    value: "end_time",
    title: "End Time",
  },
];

type FilterType = {
  search?: string;
  filter_by?: (typeof filterByOptions)[number]["value"];
  sort_by?: (typeof sortByOptions)[number]["value"];
  chain?: string;
  type?: string;
};

type AdvancedFilterProps = {
  className?: string;
};

export default function AdvancedFilter({ className }: AdvancedFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { chain } = useNetwork();

  const [filter, setFilter] = useState<FilterType>({
    search: searchParams.get("search") || "",
    filter_by: searchParams.get("filter_by") || "",
    sort_by: searchParams.get("sort_by") || "",
    chain: searchParams.get("chain") || "",
    type: searchParams.get("type") || "all",
  });

  const chains = useMemo(
    () =>
      chain?.testnet
        ? config.chains
        : config.chains.filter((item: Chain) => !item?.testnet),
    [chain]
  );

  useDebounce(
    () => {
      if (
        Object.values(filter).every((value) => !value || value === "all") &&
        searchParams.toString() === ""
      )
        return;

      const newQuery = new URLSearchParams(filter);
      if (searchParams.toString() !== newQuery.toString()) {
        router.replace(`${pathname}?${newQuery.toString()}`);
      }
    },
    500,
    [filter]
  );

  return (
    <div className={cn("flex flex-wrap gap-6 justify-between", className)}>
      <Tabs
        value={filter.type}
        onValueChange={(value) => setFilter({ ...filter, type: value })}
      >
        <TabsList>
          {tabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex flex-wrap gap-2.5">
        <Input
          placeholder="Search by token or launchpad..."
          className="max-w-full w-64"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <Select
          value={filter.filter_by}
          onValueChange={(value) => setFilter({ ...filter, filter_by: value })}
        >
          <SelectTrigger className="w-40 gap-3 whitespace-nowrap">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            {filterByOptions.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filter.sort_by}
          onValueChange={(value) => setFilter({ ...filter, sort_by: value })}
        >
          <SelectTrigger className="w-40 gap-3 whitespace-nowrap">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortByOptions.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filter.chain}
          onValueChange={(value) => setFilter({ ...filter, chain: value })}
        >
          <SelectTrigger className="w-40 gap-3">
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={""}>All Chains</SelectItem>
            {chains.map((chain) => (
              <SelectItem key={chain.id} value={`${chain.id}`}>
                {chain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
