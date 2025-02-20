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

import { Loader2, Pencil, PlusCircle } from "lucide-react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import ChapterList from "./chapter-item-list";

type TFromTitleProps = {
  courseId: string;
  initialData: Course & { chapters: Chapter[] };
};

const chapterSchema = z.object({
  title: z.string().min(1),
});

type TChapterTitle = z.infer<typeof chapterSchema>;

const ChapterForm = ({ courseId, initialData }: TFromTitleProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const defaultValues = {
    title: "",
  };
  const form = useForm<TChapterTitle>({
    resolver: zodResolver(chapterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = form;

  // form submit handler
  const onSubmit = async (value: TChapterTitle) => {
    const response = await fetch(`/api/courses/${courseId}/chapters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    const data = await response.json();
    console.log(data, "form response");
    if (data.success) {
      toast.success("chapter created successfully");
      router.refresh();
      toggleCrating();
      reset();
    } else {
      toast.error(data.message);
    }
  };

  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      const result = await fetch(`/api/courses/${courseId}/chapters/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list: updatedData,
        }),
      });

      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("ERROR:", error);
      setIsUpdating(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  const onError = (error: any) => console.log(error);

  const toggleCrating = () => setIsCreating((current) => !current);

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/50 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button type="button" variant={"ghost"} onClick={toggleCrating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle size={16} className="mr-1" /> Add Chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4 my-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="What is this course about?"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && !initialData.chapters.length && (
        <p className="text-slate-500 italic">No Chapters.</p>
      )}
      <ChapterList
        onEdit={onEdit}
        onReorder={onReorder}
        items={initialData.chapters}
      />

      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drip to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
