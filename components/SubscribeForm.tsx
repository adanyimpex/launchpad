"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAxios } from "@/hooks/useAxios";
import { FormEvent, useState } from "react";
import { FormMessage } from "./ui/form";
import LoadingBlock from "./LoadingBlock";
import { Loader2Icon } from "lucide-react";

export default function SubscribeForm({ className }: { className?: string }) {
  const axios = useAxios();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      return setError("Email is required");
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("/v1/subscriber/create", { email });
      setSuccess("Thank you for subscribing!");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div
      className={cn(
        "relative bg-[url('/images/subscribe-bg.png')] px-2 lg:px-24 py-20 rounded-lg",
        className
      )}
    >
      <div className="absolute -top-4 -left-4 bg-liteground text-4xl font-semibold w-20 h-20 flex justify-center items-center rounded-full">
        💬
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap text-white">
        <div className="max-w-xl w-full">
          <h4 className="mb-6 lg:text-4xl text-2xl font-semibold">
            Subscribe to our Newsletter
          </h4>
          <p className="text-xl">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't let the next opportunity pass you by! Subscribe to our newsletter.
          </p>
        </div>
        {!success ? (
          <form className="flex-1" onSubmit={submit}>
            <div className="relative">
              <Input
                placeholder="Enter your email"
                className="py-6 mr-24 text-black"
                value={email}
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-0 top-0 h-full flex items-center py-1 pr-1">
                <Button variant={"black"} type="submit" disabled={loading}>
                  {loading && (
                    <Loader2Icon className="animate-spin h-4 w-4 mr-1" />
                  )}
                  Subscribe
                </Button>
              </div>
            </div>
            <p className="text-sm font-medium text-destructive mt-2">{error}</p>
          </form>
        ) : (
          <p className="text-green-500 text-xl text-center">{success}</p>
        )}
      </div>
    </div>
  );
}
