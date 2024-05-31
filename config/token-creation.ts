import TokenType from "@/types/TokenType";

export const tokenContracts = {
  [TokenType.BasicToken]: () => import("@/contracts/basicToken"),
  [TokenType.BurnableToken]: () => import("@/contracts/burnableToken"),
  [TokenType.MintableToken]: () => import("@/contracts/mintableToken"),
  [TokenType.TaxToken]: () => import("@/contracts/taxToken"),
  [TokenType.MemeToken]: () => import("@/contracts/memeToken"),
};
