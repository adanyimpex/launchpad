"use client";

import { useLaunchpadStore } from "@/store/launchpadStore";
import { Launchpad } from "@/types/Launchpad";
import { useRef } from "react";

export default function LaunchpadStoreInitalizer({
  launchpad,
}: {
  launchpad: Launchpad;
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useLaunchpadStore.setState({ launchpad });
    initialized.current = true;
  }

  return null;
}
