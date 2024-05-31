import "@/app/globals.css";
import "react-toastify/ReactToastify.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { fetchCoinsPrice } from "@/utils/fetch-data";
import StoreInitalizer from "@/components/StoreInitalizer";
import { ContactPopover } from "@/components/ContactPopover";

const fontFamily = Inter({ subsets: ["latin"] });

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export const metadata: Metadata = {
  title: {
    template: "%s | Crypto UNO",
    default: "CryptoUNO",
  },
  description:
    "Discover Crypto UNO, a fully decentralized Web 3.0 marketplace where developers can easily submit their products for sale. Users can seamlessly purchase these products using cryptocurrency payments, all while enjoying automatic file delivery.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const [messages, coinsPrice] = await Promise.all([
    getMessages(params.locale),
    fetchCoinsPrice(),
  ]);

  return (
    <html
      lang={params.locale}
      dir="ltr"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body className={`${fontFamily.className}`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W0JZDX48D3"></Script>
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-W0JZDX48D3');`}
        </Script>

        <StoreInitalizer coinsPrice={coinsPrice} />

        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Providers params={params}>
            <Sidebar />
            <Navbar />
            <div className="lg:ml-[250px] flex flex-col min-h-screen">
              <div className="flex flex-col flex-1 mt-20 px-4 py-10 lg:px-12">
                {children}
              </div>
              <Footer />
            </div>
            <ContactPopover />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
