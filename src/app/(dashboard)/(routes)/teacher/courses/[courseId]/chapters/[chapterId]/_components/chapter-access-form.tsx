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
  FormDescription,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { Pencil } from "lucide-react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import {
  chapterIsFreeValidationSchema,
  TChapterIsFree,
} from "@/schema/chapter-validation-schema";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

type TChapterAccessFromProps = {
  courseId: string;
  initialData: Chapter;
  chapterId: string;
};

const ChapterAccessForm = ({
  courseId,
  initialData,
  chapterId,
}: TChapterAccessFromProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = {
    isFree: !!initialData.isFree,
  };
  const form = useForm<TChapterIsFree>({
    resolver: zodResolver(chapterIsFreeValidationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TChapterIsFree) => {
    console.log(value);
    const response = await fetch(
      `/api/courses/${courseId}/chapters/${chapterId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFree: value.isFree,
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
        Chapter Access
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil size={16} className="mr-1" /> Edit access
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
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for
                      preview
                    </FormDescription>
                  </div>
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
      {!isEditing && !initialData.isFree && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          This chapter is not free for preview.
        </p>
      )}
      {!isEditing && initialData.isFree && (
        <p className="text-sm text-slate-500 mt-2 italic">
          This chapter is free for preview.
        </p>
      )}
    </div>
  );
};

export default ChapterAccessForm;
