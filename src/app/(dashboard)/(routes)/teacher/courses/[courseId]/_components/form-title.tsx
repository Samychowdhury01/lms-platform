"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
    createCourseTitleValidationSchema,
    TCreateCourseTitle
    } from "@/schema/form-validation-schema";
import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";
import { CustomInputField } from "../../../create/_components/custom-input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type TFromTitleProps = {
  courseId: string;
  initialData: {
    title: string;
  };
};

const FormTitle = ({ courseId, initialData }: TFromTitleProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = {
    title: initialData.title || "",
  };
  const form = useForm<TCreateCourseTitle>({
    resolver: zodResolver(createCourseTitleValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TCreateCourseTitle) => {
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
      toggleEdit()
      reset();
    } else {
      toast.error(data.message);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Title
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil size={16} className="mr-1" /> Edit title
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <CustomInputField
              name="title"
              form={form}
              type="text"
              placeholder="e.g. Frontend Developer"
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p className="text-sm mt-2">{initialData?.title}</p>
      )}
    </div>
  );
};

export default FormTitle;
