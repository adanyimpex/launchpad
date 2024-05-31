"use client";

import { DiscussionEmbed } from "disqus-react";
import ClientOnly from "../ClientOnly";
import { usePathname } from "next/navigation";
import { useLaunchpadStore } from "@/store/launchpadStore";

export default function LaunchpadComments() {
  const launchpad = useLaunchpadStore((state) => state.launchpad);
  const pathname = usePathname();

  return (
    <div>
      <h4 className="font-semibold text-2xl mb-6">Comments</h4>
      <ClientOnly>
        <DiscussionEmbed
          shortname="pinky-finance"
          config={{
            url: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
            title: launchpad.token.name + " Presale",
            identifier: launchpad.sale_contract_address,
          }}
        />
      </ClientOnly>
    </div>
  );
}
