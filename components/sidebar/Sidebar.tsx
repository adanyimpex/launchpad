"use client";

import { ToggleTheme } from "../ToggleTheme";

import SidebarItem, { SidebarItemType } from "./SidebarItem";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useThemeStore from "@/store/themeStore";

const sidebarItems: SidebarItemType[] = [
  {
    name: "Launchpad list",
    link: "/",
    icon: "rocket",
  },
  {
    name: "Create launchpad",
    link: "/launchpads/create",
    icon: "plus",
  },
  {
    name: "Create token",
    link: "/create-token",
    icon: "circle-dollar-sign",
  },
  {
    name: "Buy Crypto Fiat",
    link: "/buy-crypto-fiat",
    icon: "credit-card",
  },
  {
    name: "Twitter",
    link: "https://x.com/CryptoUNO",
    icon: "twitter",
    type: "external",
  },
  {
    name: "Telegram",
    link: "https://t.me/CryptoUNOen",
    icon: "flame",
    type: "external",
  },
  {
    name: "Discord",
    link: "#",
    icon: "bot",
    type: "external",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useThemeStore();

  const closeSidebar = () => useThemeStore.setState({ isSidebarOpen: false });

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 h-full w-full bg-black/50 z-20"
          onClick={() => closeSidebar()}
        ></div>
      )}
      <aside
        className={cn(
          "fixed z-20 bg-background border-r h-full inset-0 lg:translate-x-0 transition-transform duration-300 pt-20 max-w-full w-[250px]",
          isSidebarOpen ? "translate-x-0" : "translate-x-[-250px]"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-1 px-3 py-4 overflow-auto">
            {sidebarItems.map((item, key) => (
              <SidebarItem key={key} item={item} />
            ))}
          </div>
          <div className="px-3 py-4 border-t flex justify-center">
            <ToggleTheme />
          </div>
        </div>
      </aside>
    </>
  );
}
