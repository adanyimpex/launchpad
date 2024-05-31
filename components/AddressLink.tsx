"use client";

import useWeb3Client from "@/hooks/useWeb3Client";
import { CopyIcon } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { useCopyToClipboard } from "react-use";

export default function AddressLink({
  address,
  blockExplorer,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  address: string;
  blockExplorer?: string;
}) {
  const [_, copy] = useCopyToClipboard();
  const { chain } = useWeb3Client();
  return (
    <div className="flex items-center text-sm gap-2 text-primary">
      <CopyIcon
        className="h-4 w-4 cursor-pointer hover:opacity-75"
        onClick={() => {
          copy(address);
          toast.success("Copied to clipboard");
        }}
      />
      <a
        target="_blank"
        className="hover:underline truncate lg:w-auto w-32"
        href={`${
          blockExplorer || chain.blockExplorers?.default.url
        }/address/${address}`}
        {...props}
      >
        {address}
      </a>
    </div>
  );
}
