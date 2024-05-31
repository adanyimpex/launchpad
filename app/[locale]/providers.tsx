"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from "@tanstack/react-query";

import config from "@/config";
import { useState } from "react";
import { useAxios } from "@/hooks/useAxios";

const projectId = config.walletConnectProjectId;
const chains = config.chains;

const metadata = {
  name: "Crypto UNO",
  url: "https://www.pinky.finance/",
  icons: ["https://www.pinky.finance/favicon.ico"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: chains[0] });

export function Providers({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const axios = useAxios();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: async ({ queryKey }: QueryFunctionContext) => {
              const { data } = await axios.get(`${queryKey[0]}`);
              return data?.data;
            },
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={params.dehydratedState}>{children}</Hydrate>
        </QueryClientProvider>
      </WagmiConfig>

      <ToastContainer
        theme="dark"
        closeOnClick
        pauseOnHover
        position="bottom-right"
        hideProgressBar={true}
      />
    </ThemeProvider>
  );
}
