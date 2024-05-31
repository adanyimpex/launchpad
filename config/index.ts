import TokenType from "@/types/TokenType";
import { Address, Chain } from "viem";
import {
  

 
  polygon,localhost,


} from "viem/chains";

const chains: Chain[] = [

  polygon,localhost,




];

if (process.env.NODE_ENV === "development") {
  chains.push(polygon,localhost);
}

const config = {
  chains,

  chainImages: {

    [polygon.id]: "/images/chains/polygon.svg",
    [localhost.id]:"/images/chains/polygon.svg",

  } as Record<string | number, string>,

  serviceReceiver: "0xA018d9467f3Cda7DC3731C2031851FF3F4bCdC6C" as Address,

  preSaleFactory: {

    [polygon.id]: "0xFA5cE3A4745b35d50742b4F5486333b219ce4BE9",

  } as Record<number, Address>,

  launchpadFee: {

    [polygon.id]: {
      creation: 1,
      service: 1,
    },

  } as Record<string, { creation: number; service: number }>,

  walletConnectProjectId: "d2dbe9ba7ba7f4096791dbcc187cf719",
};

export const tokenCreationPrices = {
  [TokenType.BasicToken]: {

    [polygon.id]: 1,

  } as Record<number, number>,

  [TokenType.MemeToken]: {

    [polygon.id]: 1,

  } as Record<number, number>,

  [TokenType.MintableToken]: {

    [polygon.id]: 1,

  } as Record<number, number>,

  [TokenType.BurnableToken]: {

    [polygon.id]: 1,

  } as Record<number, number>,

  [TokenType.TaxToken]: {

    [polygon.id]: 1,

  } as Record<number, number>,
};

export const languages = [
  {
    name: "English",
    code: "en",
    image: "/images/flags/en.svg",
  },

];

export default config;
