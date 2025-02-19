"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createCourseValidationSchema,
  TCourse,
} from "@/schema/form-validation-schema";
import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CustomInputField } from "../../../create/_components/custom-input";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

type TFromTitleProps = {
  courseId: string;
  initialData: {
    price: number | null;
  };
};

const PriceForm = ({ courseId, initialData }: TFromTitleProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = {
    price: initialData.price || undefined,
  };
  const form = useForm<TCourse>({
    resolver: zodResolver(createCourseValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: Pick<TCourse, "price">) => {
    console.log(value);
    const response = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: value.price,
      }),
    });
    const data = await response.json();
    console.log(data, "form response");
    if (data.success) {
      toast.success("Course updated successfully");
      router.refresh();
      toggleEdit();
      reset();
    } else {
      toast.error(data.message);
    }
  };

  const onError = (error: any) => console.log(error);

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Price
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil size={16} className="mr-1" /> Edit price
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      placeholder="Set a price for your course"
                      className="bg-white"
                      {...field}
                      step={0.01}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price && formatPrice(initialData.price) || "No price available."}
        </p>
      )}
    </div>
  );
};

export default PriceForm;
