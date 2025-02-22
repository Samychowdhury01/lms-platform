"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseActionProps {
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
}
const CourseActions = ({
  courseId,
  disabled,
  isPublished,
}: CourseActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // confirm delete
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Course deleted successful");
        router.push(`/teacher/courses`);
      } else {
        toast.error("Failed to delete chapter");
        console.log("RESPONSE:", data);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("ERROR at CONFIRM COURSE:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //   publish the course
  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        const result = await fetch(`/api/courses/${courseId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: false,
          }),
        });
        const data = await result.json();
        if (data.success) {
          toast.success("Course unpublished");
          router.refresh();
        }
      } else {
        const result = await fetch(`/api/courses/${courseId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: true,
          }),
        });
        const data = await result.json();
        if (data.success) {
          toast.success("Course published");
          router.refresh();
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.log("ERROR at onPublish COURSE:", error);
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

export default CourseActions;
