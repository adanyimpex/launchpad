import { Metadata } from "next";

const metadata: Metadata = {
  title: "Buy Crypto with Fiat",
  description: "Buy Crypto with Fiat",
};

export default function Page() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="font-semibold lg:text-4xl text-2xl mb-8">
        Buy Crypto with Fiat
      </h1>
      <div className="max-w-2xl w-full">
        <iframe
          title="Transak"
          id="transak"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
          height="750"
          className="block w-full rounded-lg border"
          src="https://global.transak.com/"
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    </main>
  );
}
