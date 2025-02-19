"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCourseValidationSchema,
  TCourse,
} from "@/schema/form-validation-schema";
import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combo-box";
import { cn } from "@/lib/utils";

type TCategoryFormProps = {
  courseId: string;
  initialData: Course;
  options: { label: string; value: string }[];
};

const CategoryForm = ({
  courseId,
  initialData,
  options,
}: TCategoryFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = {
    categoryId: initialData.categoryId || "",
  };
  const form = useForm<TCourse>({
    resolver: zodResolver(createCourseValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TCourse) => {
    const response = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
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

  const toggleEdit = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  )?.label;
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil size={16} className="mr-1" /> Edit Category
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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
      ) : (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption || "No Category Available."}
        </p>
      )}
    </div>
  );
};

export default CategoryForm;
