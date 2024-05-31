"use client";

import config from "@/config";
import React from "react";
import { useSwitchNetwork } from "wagmi";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function SwitchNetworkButton({
  chainId,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  chainId?: number;
}) {
  const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();
  const chain = config.chains.find((c) => c.id === chainId);
  return (
    <Button
      type="button"
      className={cn("truncate", className)}
      onClick={() =>
        chainId ? switchNetwork?.(chainId) : open({ view: "Networks" })
      }
      {...props}
    >
      Switch Network {chain && `to ${chain.name}`}
    </Button>
  );
}
