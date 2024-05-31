"use client";

import useStore, { StoreType } from "@/store";
import { useRef } from "react";

export default function StoreInitalizer({ coinsPrice }: Partial<StoreType>) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useStore.setState({ coinsPrice });
    initialized.current = true;
  }

  return null;
}
