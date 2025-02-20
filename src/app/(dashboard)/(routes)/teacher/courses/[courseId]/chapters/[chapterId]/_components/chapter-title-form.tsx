"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CustomInputField } from "@/app/(dashboard)/(routes)/teacher/create/_components/custom-input";
import { z } from "zod";
import { Chapter } from "@prisma/client";

type TChapterFromTitleProps = {
  courseId: string;
  initialData: Chapter;
  chapterId: string;
};

const chapterTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

type TChapterTitle = z.infer<typeof chapterTitleSchema>;
const ChapterFromTitle = ({
  courseId,
  initialData,
  chapterId,
}: TChapterFromTitleProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = {
    title: initialData.title || "",
  };
  const form = useForm<TChapterTitle>({
    resolver: zodResolver(chapterTitleSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TChapterTitle) => {
    const response = await fetch(
      `/api/courses/${courseId}/chapters/${chapterId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      }
    );
    const data = await response.json();
    console.log(data, "form response");
    if (data.success) {
      toast.success("Chapter updated successfully");
      router.refresh();
      toggleEdit();
      reset();
    } else {
      toast.error(data.message);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Title
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
              placeholder="e.g. Introduction to Python"
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

export default ChapterFromTitle;
