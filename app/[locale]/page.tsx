import AdvancedFilter from "@/components/launchpad/AdvanceFilter";
import LaunchpadItem from "@/components/launchpad/LaunchpadItem";
import Pagination from "@/components/launchpad/Pagination";

import config from "@/config";
import { preSaleAbi } from "@/contract-abi/preSaleAbi";
import { Launchpad } from "@/types/Launchpad";
import { PaginationResponse } from "@/types/Response";
import { Metadata } from "next";
import { createPublicClient, formatUnits, http, isAddress } from "viem";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/DataTable";

type PageProps = {
  searchParams: Record<string, string>;
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.pinky.finance"
  ),

  title: "Launchpad List",
  openGraph: {
    images: "/images/pinky_finance.jpg",
  },
};

const publicClient = config.chains.reduce(
  (obj, chain) => ({
    ...obj,
    [chain.id]: createPublicClient({
      chain,
      batch: { multicall: true },
      transport: http(),
    }),
  }),
  {} as Record<number, ReturnType<typeof createPublicClient>>
);

async function loadBlockchainData(launchpad: Launchpad) {
  const client = publicClient[launchpad.blockchain.id];
  if (!client || !isAddress(launchpad.sale_contract_address)) return launchpad;
  const totalTokensSold = await client.readContract({
    abi: preSaleAbi,
    address: launchpad.sale_contract_address,
    functionName: "totalTokensSold",
  });
  return {
    ...launchpad,
    totalTokensSold: +formatUnits(totalTokensSold, launchpad.token.decimals),
  };
}

async function getData({ searchParams }: PageProps) {
  const query = new URLSearchParams(searchParams);
  query.delete("type");
  const url = `${
    process.env.NEXT_PUBLIC_API_BASE_URL
  }/v1/launchpad?${query.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  const launchpads: PaginationResponse<Launchpad> = await res.json();
  launchpads.data = await Promise.all(launchpads.data.map(loadBlockchainData));
  return launchpads;
}

export default async function LaunchpadsPage({ searchParams }: PageProps) {
  const { data, meta } = await getData({ searchParams });

  return (
    <main className="">
      <div className="mb-12">
        <h1 className="font-semibold lg:text-4xl text-2xl">Launchpad List</h1>
      </div>
      <AdvancedFilter className="mb-8" />
      {data.length > 0 ? (
        <>
          {searchParams.type === "advanced" ? (
            <DataTable columns={columns} data={data} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.map((launchpad) => (
                <LaunchpadItem key={launchpad.id} item={launchpad} />
              ))}
            </div>
          )}
          <Pagination meta={meta} />
        </>
      ) : (
        <div className="text-center mt-24">
          <p className="text-2xl">No Launchpad Found</p>
        </div>
      )}
    </main>
  );
}
