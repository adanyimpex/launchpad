/* eslint-disable react-hooks/exhaustive-deps */
import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import TextField from "../form/TextField";
import { Form } from "../ui/form";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import useLaunchpadActions from "@/hooks/useLaunchpadActions";
import { useLaunchpadStore } from "@/store/launchpadStore";

const formSchema = z
  .object({
    start_time: z.string().refine((data) => dayjs().isBefore(data), {
      message: "Start time needs to be after now",
    }),
    end_time: z.string(),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });

type Props = DialogProps & {
  onClose: () => void;
};

export default function ChangeTimeModal({ onClose, ...props }: Props) {
  const launchpad = useLaunchpadStore((state) => state.launchpad);
  const { changeSaleTime } = useLaunchpadActions();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_time: launchpad.start_time,
      end_time: launchpad.end_time,
    },
  });

  const submit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { hash } = await changeSaleTime(values.start_time, values.end_time);

    if (hash) {
      useLaunchpadStore.setState({ launchpad: { ...launchpad, ...values } });
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <Dialog {...props}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="">
          <DialogTitle>Change Launchpad Start/End Time</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-6 pt-6">
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
            <DialogFooter>
              <Button type="button" variant={"ghost"} onClick={() => onClose()}>
                Close
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading && (
                  <Loader2Icon className="animate-spin mr-2 h-5 w-5" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
