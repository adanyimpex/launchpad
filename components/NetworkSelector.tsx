"use client";

import { useNetwork } from "wagmi";
import { Button } from "./ui/button";
import config from "@/config";
import { ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { cn } from "@/lib/utils";
import ClientOnly from "./ClientOnly";

export default function NetworkSelector({ className }: { className?: string }) {
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const selectedChain = chain || config.chains[0];
  return (
    <ClientOnly>
      <Button
        variant={"outline"}
        className={cn("gap-2", className)}
        onClick={() => open({ view: "Networks" })}
      >
        {chain?.unsupported ? (
          <GlobeIcon className="h-6 w-6 object-contain" />
        ) : (
          config.chainImages[selectedChain.id] && (
            <img
              src={config.chainImages[selectedChain.id]}
              alt={selectedChain.id.toString()}
              className="h-6 w-6 object-contain"
            />
          )
        )}

        <span className="uppercase">
          {chain?.unsupported ? "Not supported" : selectedChain.name}
        </span>
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
    </ClientOnly>
  );
}
