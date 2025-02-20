"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import {
  chapterDescriptionValidationSchema,
  TChapterDescription,
} from "@/schema/chapter-validation-schema";
import Editor from "@/components/editor";
import Preview from "@/components/preview";

type TChapterFromDescriptionProps = {
  courseId: string;
  initialData: Chapter;
  chapterId: string;
};

const ChapterFormDescription = ({
  courseId,
  initialData,
  chapterId,
}: TChapterFromDescriptionProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = {
    description: initialData.description || "",
  };
  const form = useForm<TChapterDescription>({
    resolver: zodResolver(chapterDescriptionValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TChapterDescription) => {
    console.log(value.description)
    const response = await fetch(
      `/api/courses/${courseId}/chapters/${chapterId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: value.description,
        }),
      }
    );
    const data = await response.json();

    if (data.success) {
      toast.success("Chapter updated successfully");
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
        Chapter Description
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil size={16} className="mr-1" /> Edit description
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
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
            !initialData.description && "text-slate-500 italic"
          )}
        >
          No description available.
        </p>
      )}
      {!isEditing && initialData.description && (
        <Preview value={initialData.description} />
      )}
    </div>
  );
};

export default ChapterFormDescription;
