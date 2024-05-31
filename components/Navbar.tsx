import WalletConnect from "./WalletConnect";
import NetworkSelector from "./NetworkSelector";
import Link from "next/link";
import ToggleSidebarButton from "./ToggleSidebarButton";

export default function Navbar() {
  return (
    <nav className="fixed z-30 inset-0 bg-background border-b h-20">
      <div className="lg:px-8 px-4 h-full flex justify-between items-center">
        <ToggleSidebarButton className="lg:hidden inline-flex" />
        <Link href="/" className="hover:opacity-75 transition-opacity">
          <img
            src="/images/logo.svg"
            alt="Crypto UNO"
            className="dark:hidden block max-w-full lg:h-12 h-8"
          />
          <img
            src="/images/dark-logo.svg"
            alt="Crypto UNO"
            className="dark:block hidden max-w-full lg:h-12 h-8"
          />
        </Link>
        <div className="flex gap-5">
          <NetworkSelector className="lg:inline-flex hidden" />
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
