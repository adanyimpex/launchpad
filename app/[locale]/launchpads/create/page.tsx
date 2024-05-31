"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import FormVerifyStep from "./_components/FormVeifyStep";
import FormDefiInfo from "./_components/FormDefiInfo";
import FormAddtionalInfo from "./_components/FormAddtionalInfo";
import FormFinish from "./_components/FormFinish";

const steps = [1, 2, 3, 4];

export default function Page() {
  const [active, setActive] = useState(0);
  const nextStep = () => {
    setActive(active + 1);
    scrollTo(0, 0);
  };
  const prevStep = () => {
    setActive(active - 1);
    scrollTo(0, 0);
  };

  const [form, setForm] = useState<Record<string, any>>({});

  return (
    <main className="">
      <div className="flex items-center lg:-mx-12 mb-6">
        <div className="flex-1 h-0.5 bg-primary"></div>
        <div className="flex items-center max-w-6xl w-full justify-between mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn("flex items-center", {
                "flex-1": index < steps.length - 1,
              })}
            >
              <div
                className={cn(
                  "h-10 w-10 bg-primary text-white rounded-full select-none flex items-center justify-center",
                  active >= index
                    ? "bg-primary"
                    : "dark:bg-[#1E1E1E] bg-[#E2E8F0]"
                )}
              >
                {step}
              </div>
              <div
                className={cn(
                  "flex-1 h-0.5",
                  active > index
                    ? "bg-primary"
                    : "dark:bg-[#CBD5E1]/20 bg-[#CBD5E1]"
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex-1 h-0.5 dark:bg-[#CBD5E1]/20 bg-[#CBD5E1]"></div>
      </div>
      <div
        className={cn({
          hidden: active !== 0,
        })}
      >
        <FormVerifyStep
          onSubmit={(values) => {
            setForm({ ...form, ...values });
            nextStep();
          }}
        />
      </div>
      <div
        className={cn({
          hidden: active !== 1,
        })}
      >
        <FormDefiInfo
          onSubmit={(values) => {
            setForm({ ...form, ...values });
            nextStep();
          }}
          onBack={prevStep}
        />
      </div>
      <div
        className={cn({
          hidden: active !== 2,
        })}
      >
        <FormAddtionalInfo
          onSubmit={(values) => {
            setForm({ ...form, ...values });
            nextStep();
          }}
          onBack={prevStep}
        />
      </div>
      <div
        className={cn({
          hidden: active !== 3,
        })}
      >
        <FormFinish form={form} onBack={prevStep} />
      </div>
    </main>
  );
}
