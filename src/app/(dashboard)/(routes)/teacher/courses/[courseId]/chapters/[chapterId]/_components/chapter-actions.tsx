"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionProps {
  courseId: string;
  chapterId: string;
  disabled: boolean;
  isPublished: boolean;
}
const ChapterActions = ({
  chapterId,
  courseId,
  disabled,
  isPublished,
}: ChapterActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // confirm delete
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Chapter deleted successful");
        router.push(`/teacher/courses/${courseId}`);
      } else {
        toast.error("Failed to delete chapter");
        console.log("RESPONSE:", data);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("ERROR at CONFIRM:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //   publish the course
  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        const result = await fetch(
          `/api/courses/${courseId}/chapters/${chapterId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isPublished: false,
            }),
          }
        );
        const data = await result.json();
        if (data.success) {
          toast.success("Chapter unpublished");
          router.refresh();
        }
      } else {
        const result = await fetch(
          `/api/courses/${courseId}/chapters/${chapterId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isPublished: true,
            }),
          }
        );
        const data = await result.json();
        if (data.success) {
          toast.success("Chapter published");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("ERROR at onPublish:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="icon" disabled={isLoading}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
