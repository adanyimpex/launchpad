import config from "@/config";

export const fetchCoinsPrice = async () => {
  const symbols = [
    ...new Set(config.chains.map((chain) => chain.nativeCurrency.symbol)),
  ].join(",");

  const response = await fetch(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY || "",
      },
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!response.ok) return {};

  const { data } = await response.json();

  const coinsPrice = Object.keys(data).reduce(
    (acc, key) => {
      acc[key] = data[key]?.[0]?.quote.USD.price;
      return acc;
    },
    {} as Record<string, number>
  );

  return coinsPrice;
};
