"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

import TokenType from "@/types/TokenType";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCopyToClipboard } from "react-use";
import config, { tokenCreationPrices } from "@/config";
import { Token, TokenOnDepolyType } from "@/types/Token";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TokenForm from "./_components/token-form";

const tokenTypes = [
  TokenType.BasicToken,
  TokenType.BurnableToken,
  TokenType.MintableToken,
  TokenType.MemeToken,
  TokenType.TaxToken,
] as const;

const formSchema = z.object({
  token_type: z.enum(tokenTypes),
  name: z.string().min(0, "Name is required"),
  symbol: z.string().min(0, "Symbol is required"),
  decimals: z.coerce.number().int().min(6).max(18),
  total_supply: z.coerce.number().int().positive(),
});

type TokenData =
  | (Token & { transaction_hash: string; total_supply: number })
  | null;

const chain = config.chains[0];

export default function Page() {
  const [tokenType, setTokenType] = useState<ValueOf<typeof TokenType>>(
    TokenType.BasicToken
  );
  const [tokenData, setTokenData] = useState<TokenData>(null);

  const [_, copy] = useCopyToClipboard();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      token_type: TokenType.BasicToken,
      name: "",
      symbol: "",
      decimals: "" as any,
      total_supply: "" as any,
    },
  });

  const copyAddress = () => {
    if (!tokenData?.contract_address) return;
    copy(tokenData.contract_address);
    toast.success("Address copied to clipboard");
  };

  const onDeploy = async (token: TokenOnDepolyType) => {
    setTokenData({
      ...token,
    });
  };

  if (!tokenData) {
    return (
      <Card>
        <CardContent>
          <div className="flex gap-4 p-2 mb-4 rounded-md bg-primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_77)">
                <path
                  d="M37.162 4.28L24.632 0.102001C24.2217 -0.0346412 23.7783 -0.0346412 23.368 0.102001L10.838 4.28C8.84581 4.94176 7.11283 6.21452 5.88529 7.91742C4.65774 9.62033 3.99807 11.6668 4 13.766V24C4 39.126 22.4 47.48 23.188 47.828C23.4436 47.9416 23.7203 48.0003 24 48.0003C24.2797 48.0003 24.5564 47.9416 24.812 47.828C25.6 47.48 44 39.126 44 24V13.766C44.0019 11.6668 43.3422 9.62033 42.1147 7.91742C40.8872 6.21452 39.1542 4.94176 37.162 4.28ZM33.436 19.434L24.892 27.978C24.5424 28.33 24.1263 28.609 23.6679 28.7989C23.2096 28.9887 22.7181 29.0856 22.222 29.084H22.156C21.6498 29.0763 21.1504 28.9659 20.688 28.7597C20.2257 28.5534 19.8099 28.2555 19.466 27.884L14.854 23.084C14.6543 22.8987 14.4945 22.6745 14.3845 22.4252C14.2745 22.176 14.2166 21.9068 14.2144 21.6344C14.2121 21.3619 14.2655 21.0919 14.3714 20.8408C14.4773 20.5898 14.6333 20.363 14.8299 20.1744C15.0266 19.9858 15.2597 19.8394 15.515 19.7441C15.7702 19.6488 16.0423 19.6067 16.3144 19.6204C16.5865 19.634 16.853 19.7031 17.0974 19.8234C17.3419 19.9437 17.5592 20.1127 17.736 20.32L22.224 25L30.6 16.6C30.9772 16.2357 31.4824 16.0341 32.0068 16.0387C32.5312 16.0432 33.0328 16.2536 33.4036 16.6244C33.7744 16.9952 33.9848 17.4968 33.9893 18.0212C33.9939 18.5456 33.7923 19.0508 33.428 19.428L33.436 19.434Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_77">
                  <rect width="48" height="48" fill="currentColor" />
                </clipPath>
              </defs>
            </svg>
            <div>
              <p className="">
                All the tokens smart contracts are fully ready for auditing and
                will pass any audits.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label aria-required>Token Type</Label>
              <Select
                onValueChange={(value) =>
                  setTokenType(value as (typeof tokenTypes)[number])
                }
                defaultValue={TokenType.BasicToken}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokenTypes.map((value, key) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-primary">
                Fee: {tokenCreationPrices[tokenType][chain.id]}{" "}
                {chain.nativeCurrency.symbol}
              </div>
            </div>
            <TokenForm tokenType={tokenType} onDeploy={onDeploy} />
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardContent>
          <p className="mb-6 text-lg font-bold text-center text-green-600">
            Thank you! Your token was generated successfully, below you can see
            all the details.
          </p>
          <table className="w-full mb-12 text-sm table-auto">
            <tbody className="divide-y">
              <tr>
                <td className="px-3 py-3 capitalize ">Token name</td>
                <td className="px-3 py-3 font-medium break-all text-primary">
                  {tokenData.name}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-3 capitalize ">Token symbol</td>
                <td className="px-3 py-3 font-medium break-all text-primary">
                  {tokenData.symbol}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-3 capitalize ">Total decimals</td>
                <td className="px-3 py-3 font-medium break-all text-primary">
                  {tokenData.decimals}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-3 capitalize ">Total supply</td>
                <td className="px-3 py-3 font-medium break-all text-primary">
                  {tokenData.total_supply.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-3 capitalize ">Token address</td>
                <td className="px-3 py-3 font-medium break-all text-primary">
                  <a
                    href={`${chain.blockExplorers?.default.url}/address/${tokenData.contract_address}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {tokenData.contract_address}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a
                href={`${chain.blockExplorers?.default.url}/tx/${tokenData.transaction_hash}`}
                target="_blank"
              >
                View transactions
              </a>
            </Button>
            <Button variant="outline" onClick={copyAddress}>
              Copy address
            </Button>
            <Button
              onClick={() => {
                setTokenData(null);
                form.reset();
              }}
            >
              Create another token
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}
