"use client";

import { useAccount } from "wagmi";
import ClientOnly from "../ClientOnly";
import { KeyIcon } from "lucide-react";
import { TooltipContainer } from "../ui/tooltip";

export default function OwnerBadge({ ownerAddress }: { ownerAddress: string }) {
  const { address } = useAccount();
  return (
    <ClientOnly>
      {ownerAddress === address && (
        <TooltipContainer title={"You are the owner"}>
          <div className="flex items-center justify-center text-[#62551B] bg-[#F9DC58] p-2 rounded-md">
            <KeyIcon className="h-5 w-5" />
          </div>
        </TooltipContainer>
      )}
    </ClientOnly>
  );
}
