import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TCreateCourse } from "@/schema/form-validation-schema";

import { UseFormReturn } from "react-hook-form";

type TNameType = keyof TCreateCourse;

type TInputProps = {
  label: string;
  name: TNameType;
  type: any;
  placeholder?: string;
  isSubmitting?: boolean;
  form: UseFormReturn<TCreateCourse>;
  description?: string;
};

/**
 * Custom input field component for forms.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label to display for the input field.
 * @param {string} props.name - The name attribute for the input field, also used as the form field name.
 * @param {string} props.type - The input type (e.g., 'text', 'password', etc.).
 * @param {string} [props.placeholder] - The placeholder text to display inside the input field.
 * @param {UseFormReturn<TCreateJobValues>} props.form - The react-hook-form instance used to manage form state.
 *
 * @returns {JSX.Element} - A FormField with an input element rendered inside.
 */
export const CustomInputField = ({
  form,
  label,
  placeholder,
  type,
  name,
  isSubmitting,
  description,
}: TInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            {type === "file" ? (
              <Input
                type="file"
                accept="image/*"
                placeholder={placeholder}
                onChange={(e) => field.onChange(e.target.files?.[0])}
                ref={field.ref}
              />
            ) : (
              // @ts-ignore
              <Input
                disabled={isSubmitting}
                type={type}
                placeholder={placeholder}
                {...field}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
