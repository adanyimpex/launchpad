import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

const RadioGroupField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  rules,
  name,
  className,
  label,
  values,
  direction = "column",
}: Omit<ControllerProps<TFieldValues, TName>, "render"> &
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    values: { value: string; label: string }[] | string[];
    direction?: "row" | "column";
  }) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", className)}>
          <FormLabel className="capitalize">
            {label || name.replaceAll("_", " ")}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn("flex flex-wrap", {
                "flex-col space-y-1": direction === "column",
                "flex-row space-x-3": direction === "row",
              })}
            >
              {values.map((item) => {
                const value = typeof item === "string" ? item : item.value;
                const label = typeof item === "string" ? item : item.label;
                return (
                  <FormItem
                    key={value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioGroupField;
