import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

const CheckboxGroupField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  className,
  label,
  values,
  onChange,
}: Omit<ControllerProps<TFieldValues, TName>, "render"> &
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    values: { value: string | number; label: string }[] | string[];
    onChange?: (
      values: { value: string | number; label: string }[] | string[]
    ) => void;
  }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <div className="mb-4">
            <FormLabel className="capitalize">
              {label || name.replaceAll("_", " ")}
            </FormLabel>
          </div>
          {values.map((item) => {
            const value = typeof item === "string" ? item : item.value;
            const label = typeof item === "string" ? item : item.label;
            return (
              <FormField
                key={value}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormItem
                    key={value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(value)}
                        onCheckedChange={(checked) => {
                          const newValues = checked
                            ? [...field.value, value]
                            : field.value?.filter((v: any) => v !== value);
                          field.onChange(newValues);
                          onChange?.(newValues);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                )}
              />
            );
          })}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxGroupField;
