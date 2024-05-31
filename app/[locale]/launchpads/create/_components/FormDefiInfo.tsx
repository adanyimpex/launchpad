"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import dayjs from "dayjs";
import { useState } from "react";
import { useCreateLaunchpadStore } from "@/store/createLaunchpadStore";

const formSchema = z
  .object({
    token_price: z.coerce.number().positive(),
    softcap: z.coerce.number().positive(),
    hardcap: z.coerce.number().positive(),
    min_buy_amount: z.coerce.number().min(0),
    max_buy_amount: z.coerce.number().min(0),
    refund_type: z.string(),
    start_time: z.string().refine((data) => dayjs().isBefore(data), {
      message: "Start time needs to be after now",
    }),
    end_time: z.string(),
  })
  .refine((data) => data.hardcap >= data.softcap, {
    message: "Hardcap must be greater than or equal Softcap",
    path: ["hardcap"],
  })
  .refine((data) => data.hardcap <= data.softcap * 0.25 + data.softcap, {
    message: "Hardcap must be less than or equal 25% of Softcap",
    path: ["hardcap"],
  })
  .refine((data) => data.max_buy_amount >= data.min_buy_amount, {
    message: "Maximum buy must be greater than minimum buy",
    path: ["max_buy_amount"],
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });

export type FormDefiInfoType = z.infer<typeof formSchema>;

export default function FormDefiInfo({
  onSubmit = () => {},
  onBack,
}: {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  onBack: () => void;
}) {
  const saleToken = useCreateLaunchpadStore((state) => state.token);
  const [rate, setRate] = useState(0.001);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      token_price: "" as any,
      softcap: "" as any,
      hardcap: "" as any,
      min_buy_amount: "" as any,
      max_buy_amount: "" as any,
      refund_type: "refund",
      start_time: "",
      end_time: "",
    },
  });

  return (
    <div className="max-w-6xl w-full mx-auto">
      <h1 className="mb-4 text-2xl font-semibold">DeFi Launchpad Info</h1>
      <h4 className="mb-6 max-w-md">
        Enter the launchpad information that you want to raise, that should be
        enter all details about your presale
      </h4>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TextField
                control={form.control}
                name="token_price"
                label="Price per token (USD)"
                input={{
                  placeholder: "0.001",
                  step: 0.000001,
                  type: "number",
                  min: 0,
                  required: true,
                  onInput: (e) => setRate(+e.currentTarget.value),
                }}
                description={`For ${rate} USD investor will receive 1 (${saleToken?.symbol})`}
              />
              {/* <RadioGroupField
                control={form.control}
                name="whitelist"
                direction="row"
                values={[
                  { value: false as any, label: "Disabled" },
                  { value: true as any, label: "Enabled" },
                ]}
              /> */}
              <div className="grid lg:grid-cols-2 gap-6">
                <TextField
                  control={form.control}
                  name="softcap"
                  label={`SoftCap (${saleToken?.symbol})`}
                  input={{
                    placeholder: "100000",
                    type: "number",
                    required: true,
                    min: 0,
                  }}
                  description="Softcap must be >= 25% of Hardcap!"
                />
                <TextField
                  control={form.control}
                  name="hardcap"
                  label={`HardCap (${saleToken?.symbol})`}
                  input={{
                    placeholder: "300000",
                    type: "number",
                    required: true,
                    min: 0,
                  }}
                />
                <TextField
                  control={form.control}
                  name="min_buy_amount"
                  label={`Minimum Buy (${saleToken?.symbol})`}
                  input={{
                    placeholder: "1",
                    type: "number",
                    required: true,
                    min: 0,
                  }}
                />
                <TextField
                  control={form.control}
                  name="max_buy_amount"
                  label={`Maximum Buy (${saleToken?.symbol})`}
                  input={{
                    placeholder: "1000",
                    type: "number",
                    required: true,
                    min: 0,
                  }}
                  description="if you don't want to set maximum buy, you can set 0"
                />
                <SelectField
                  control={form.control}
                  name="refund_type"
                  label="Refund Type"
                  values={[
                    // { value: "burn", label: "Burn" },
                    { value: "refund", label: "Refund" },
                  ]}
                />
              </div>
              {/* <div className="bg-muted rounded-md text-muted-foreground py-4 px-4 text-sm">
                <p className="text-primary text-xs mb-5">
                  Enter the percentage of raised funds that should be allocated
                  to Liquidity on Pancakeswap (Min 51%, Max 100%)
                </p>
                <p className="text-primary mb-2.5">
                  If I spend 1 BNB on Pancakeswap how many tokens will I
                  receive?
                </p>
                <p>
                  Usually this amount is lower than presale rate to allow for
                  higher listing price on Pancakeswap
                </p>
              </div> */}
              <p className="text-lg font-medium">
                Select start time & end time
              </p>
              <div className="grid lg:grid-cols-2 gap-6">
                <TextField
                  control={form.control}
                  name="start_time"
                  label="Start time"
                  input={{
                    type: "datetime-local",
                    placeholder: "Select Date",
                  }}
                />
                <TextField
                  control={form.control}
                  name="end_time"
                  label="End time"
                  input={{
                    type: "datetime-local",
                    placeholder: "Select Date",
                  }}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button type="button" variant={"secondary"} onClick={onBack}>
                  Back
                </Button>
                <Button type="submit" disabled={!form.formState.isValid}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
