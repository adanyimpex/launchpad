"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import TextField from "@/components/form/TextField";
import TextareaField from "@/components/form/TextareaField";

const formSchema = z.object({
  logo: z.string().min(1, "Logo is required").url(),
  website: z.string().min(1, "Website is required").url(),
  telegram: z.string().url().or(z.literal("")),
  twitter: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  facebook: z.string().url().or(z.literal("")),
  github: z.string().url().or(z.literal("")),
  discord: z.string().url().or(z.literal("")),
  medium: z.string().url().or(z.literal("")),
  reddit: z.string().url().or(z.literal("")),
  youtube_video: z.string().url().or(z.literal("")),
  description: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .or(z.literal("")),
});

export type FormAddtionalInfoType = z.infer<typeof formSchema>;

export default function FormAddtionalInfo({
  onSubmit = () => {},
  onBack,
}: {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  onBack: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: "",
      website: "",
      telegram: "",
      twitter: "",
      instagram: "",
      facebook: "",
      github: "",
      medium: "",
      reddit: "",
      discord: "",
      youtube_video: "",
      description: "",
    },
  });

  return (
    <div className="max-w-6xl w-full mx-auto">
      <h1 className="mb-4 text-2xl font-semibold">Add additional project information</h1>
      <h4 className="mb-6 max-w-md">Let everyone know more about your project.</h4>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <TextField
                  control={form.control}
                  name="logo"
                  input={{
                    placeholder: "Ex: https://...",
                    type: "url",
                    required: true,
                  }}
                  description={
                    <>
                      URL must end with a supported image extension png, jpg,
                      jpeg or gif.
                      {/* You can upload your image at{" "}
                      <a
                        href="https://upload.pinky.finance/"
                        className="text-black hover:underline"
                      >
                        https://upload.pinky.finance/
                      </a> */}
                    </>
                  }
                />
                <TextField
                  control={form.control}
                  name="website"
                  input={{
                    placeholder: "Ex: https://...",
                    type: "url",
                    required: true,
                  }}
                />
                <TextField
                  control={form.control}
                  name="facebook"
                  input={{
                    placeholder: "Ex: https://facebook.com/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="twitter"
                  input={{
                    placeholder: "Ex: https://twitter.com/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="github"
                  input={{
                    placeholder: "Ex: https://github.com/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="telegram"
                  input={{
                    placeholder: "Ex: https://t.me/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="instagram"
                  input={{
                    placeholder: "Ex: https://instagram.me/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="discord"
                  input={{
                    placeholder: "Ex: https://discord.gg/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="reddit"
                  input={{
                    placeholder: "Ex: https://reddit.com/r/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="medium"
                  input={{
                    placeholder: "Ex: https://medium.com/...",
                    type: "url",
                  }}
                />
                <TextField
                  control={form.control}
                  name="youtube_video"
                  input={{
                    placeholder:
                      "Ex: https://www.youtube.com/watch?v=xxxxxxxxx",
                    type: "url",
                  }}
                  className="lg:col-span-2"
                />
                <TextareaField
                  control={form.control}
                  name="description"
                  textarea={{
                    placeholder: "Ex: This is the best project...",
                    className: "resize-none",
                    rows: 6,
                  }}
                  className="lg:col-span-2"
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
