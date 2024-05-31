"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { LogOutIcon, UserIcon, WalletIcon } from "lucide-react";
import ClientOnly from "./ClientOnly";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

export default function WalletConnect() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();

  // TODO: add disconnect funtion from api as well
  const { disconnect } = useDisconnect();

  return (
    <ClientOnly>
      {isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:px-0 max-lg:py-0"
              variant="black"
            >
              <WalletIcon className="h-6 w-6" />
              <span className="font-semibold hidden lg:inline">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href={`/user/${address}`}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => open()} variant="black">
          Connect
        </Button>
      )}
    </ClientOnly>
  );
}
