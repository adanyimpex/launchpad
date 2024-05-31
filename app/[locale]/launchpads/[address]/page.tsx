import { Launchpad } from "@/types/Launchpad";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { useLaunchpadStore } from "@/store/launchpadStore";
import LaunchpadStoreInitalizer from "./LaunchpadStoreInitalizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipContainer } from "@/components/ui/tooltip";
import OwnerBadge from "@/components/launchpad/OwnerBadge";
import { ExternalLinkIcon, GlobeIcon, HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressLink from "@/components/AddressLink";
import SocialLinks from "@/components/launchpad/SocialLink";
import SaleForm from "@/components/launchpad/SaleForm";
import SaleInfo from "@/components/launchpad/SaleInfo";
import OwnerZone from "@/components/launchpad/OwnerZone";
import dayjs from "dayjs";
import StatusBadge from "@/components/launchpad/StatusBadge";

async function getItem(address: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/launchpad/${address}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return undefined;
  return res.json();
}

type Props = {
  params: { address: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const launchpad: Launchpad = await getItem(params.address);

  return {
    title: "Buy " + launchpad.token.name + " tokens now (Sale is Live)",
  };
}

export default async function page({ params }: Props) {
  const launchpad: Launchpad | undefined = await getItem(params.address);

  if (!launchpad) {
    redirect("/404");
  }

  useLaunchpadStore.setState({ launchpad });
  return (
    <>
      <LaunchpadStoreInitalizer launchpad={launchpad} />
      <main>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="space-y-6 lg:pb-6 bg-[#CBD5E1]/20 rounded-xl">
                <div className="flex gap-4 flex-wrap items-center lg:justify-between justify-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={launchpad.logo || "/images/avatar.png"}
                      alt="avatar"
                      className="object-cover rounded-full h-12 w-12"
                    />
                    <div className="flex items-center w-full gap-2">
                      <p className="font-semibold lg:text-xl">
                        {launchpad.token.name} Presale
                      </p>
                      <TooltipContainer title={launchpad.blockchain.name}>
                        <img
                          src={launchpad.blockchain.image}
                          alt={launchpad.blockchain.name}
                          className="w-6 h-6 object-contain"
                        />
                      </TooltipContainer>

                      <OwnerBadge
                        ownerAddress={launchpad.contract_owner_address}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <a
                      href={launchpad.website || "#"}
                      target="_blank"
                      className="flex text-sm items-center gap-2 text-primary underline hover:no-underline"
                    >
                      <GlobeIcon className="h-5 w-5" />
                      Website
                    </a>
                    <Button variant={"ghost"} size={"icon"}>
                      <HeartIcon className="h-5 w-5" />
                    </Button>
                    <StatusBadge
                      type={useLaunchpadStore.getState().computed.status}
                    />
                  </div>
                </div>
                <p className="leading-loose">{launchpad.description}</p>
              </CardHeader>
              <CardContent>
                <table className="w-full table-auto text-sm">
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-3">Sale Address</td>
                      <td className="py-3 px-3 break-all flex justify-end">
                        <AddressLink
                          blockExplorer={launchpad.blockchain.explorer_url}
                          address={launchpad.sale_contract_address}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Token Name</td>
                      <td className="py-3 px-3 break-all text-right">
                        {launchpad.token.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Token Symbol</td>
                      <td className="py-3 px-3 break-all text-right">
                        {launchpad.token.symbol}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Token Decimals</td>
                      <td className="py-3 px-3 break-all text-right">
                        {launchpad.token.decimals}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Token Address</td>
                      <td className="py-3 px-3 break-all flex flex-col items-end justify-end">
                        <AddressLink
                          blockExplorer={launchpad.blockchain.explorer_url}
                          address={launchpad.token.contract_address}
                        />
                        <span className="lg:block hidden">
                          (Do not send ETH to the token address!)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Tokens For Presale</td>
                      <td className="py-3 px-3 break-all text-right">
                        {launchpad.hardcap.toLocaleString()}{" "}
                        {launchpad.token.symbol}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Soft Cap</td>
                      <td className="py-3 px-3 break-all text-right">
                        {launchpad.softcap.toLocaleString()}{" "}
                        {launchpad.token.symbol}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Presale Start Time</td>
                      <td className="py-3 px-3 break-all text-right">
                        {dayjs(launchpad.start_time).format(
                          "YYYY.MM.DD hh:mm A"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">Presale End Time</td>
                      <td className="py-3 px-3 break-all text-right">
                        {dayjs(launchpad.end_time).format("YYYY.MM.DD hh:mm A")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <SocialLinks
                    links={{
                      facebook: launchpad.facebook,
                      twitter: launchpad.twitter,
                      instagram: launchpad.instagram,
                    }}
                  />
                  <a
                    href={launchpad.website || "#"}
                    target="_blank"
                    className="flex items-center w-0 justify-center gap-2 flex-1 bg-[#CBD5E1]/20 rounded-xl py-2 font-medium px-6"
                  >
                    <span className="w-full truncate">{launchpad.website}</span>
                    <ExternalLinkIcon className="flex-shrink-0 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
            {/* <LaunchpadComments /> */}
          </div>
          <div className="space-y-6">
            <SaleForm />
            <SaleInfo />
            <OwnerZone />
          </div>
        </div>
      </main>
    </>
  );
}
