"use client";

import TextField from "@/components/form/TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Path, useForm } from "react-hook-form";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import config from "@/config";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function DynamicTokenForm<T extends z.ZodObject<z.ZodRawShape>>({
  onSubmit,
  schema,
}: {
  schema: T;
  onSubmit: (values: z.infer<T>) => void;
}) {
  const { switchNetwork } = useSwitchNetwork();
  const { chain: currentChain } = useNetwork();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const form = useForm<z.infer<T>>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-3 lg:grid-cols-2">
          {Object.entries(schema.shape).map(([key, value]) => (
            <TextField
              key={key}
              control={form.control}
              name={key as Path<z.infer<T>>}
              input={{
                type: value instanceof z.ZodNumber ? "number" : "text",
                required: true,
              }}
            />
          ))}
        </div>
        <div className="flex justify-center">
          {!isConnected ? (
            <Button type="button" onClick={() => open()}>
              Connect Wallet
            </Button>
          ) : currentChain?.unsupported ? (
            <Button
              type="button"
              onClick={() => switchNetwork?.(config.chains[0].id)}
            >
              Change to {config.chains[0].name} network
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="items-center gap-2"
            >
              {form.formState.isSubmitting && (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              )}
              Generate Token
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
