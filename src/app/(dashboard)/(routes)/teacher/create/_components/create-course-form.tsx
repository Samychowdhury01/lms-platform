"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  createCourseValidationSchema,
  TCreateCourse,
} from "@/schema/form-validation-schema";
import Container from "@/components/ui/container";
import { CustomInputField } from "./custom-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

const CreateCourseForm = () => {
  const defaultValues = {
    title: "",
  };
  const form = useForm<TCreateCourse>({
    resolver: zodResolver(createCourseValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TCreateCourse) => {
    toast.success(value.title)
    console.log(value)
  };

  return (
    <>
      <div className="flex md:items-center md:justify-center h-full">
        <div>
          <h1 className="text-2xl">Name your course</h1>
          <p className="text-sm text-slate-600">
            What would you like to call your course? Don't worry, you can change
            this later.
          </p>
          <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <CustomInputField
            form={form}
            label="Course Title"
            name="title"
            type="text"
            placeholder="e.g. 'Advanced web development'"
            isSubmitting={isSubmitting}
            description="What will you teach in this course"
          />
           <div className="flex items-center gap-x-2">
          <Button asChild type="button" variant="outline">
            <Link href="/">Cancel</Link>
          </Button>
          <Button disabled={isSubmitting || !isValid} type="submit">
            Continue
          </Button>
        </div>
        </form>
       
      </Form>
        </div>
      </div>

      
    </>
  );
};

export default CreateCourseForm;
