"use client";

import { useTheme } from "next-themes";

import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useMemo } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import ClientOnly from "./ClientOnly";

export function ToggleTheme() {
  const { setTheme, resolvedTheme } = useTheme();
  const isChecked = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);
  return (
    <ClientOnly>
      <div className="flex items-center space-x-2">
        {isChecked ? (
          <MoonIcon className="w-5 h-5" />
        ) : (
          <SunIcon className="w-5 h-5" />
        )}
        <Switch
          id="toggle-theme"
          className="data-[state=checked]:bg-[#3ED04C]"
          bulletClassName="bg-white"
          checked={isChecked}
          onCheckedChange={(val) =>
            val ? setTheme("dark") : setTheme("light")
          }
        />
        <Label htmlFor="airplane-mode">Dark Mode</Label>
      </div>
    </ClientOnly>
  );
}
