"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Loader, Pencil, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";
import { Attachment, Course } from "@prisma/client";

type TAttachmentFromProps = {
  courseId: string;
  initialData: Course & { attachments: Attachment[] };
};

const AttachmentFrom = ({ courseId, initialData }: TAttachmentFromProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // form submit handler
  const onSubmit = async (value: { url: string }) => {
    const response = await fetch(`/api/courses/${courseId}/attachments`, {
      method: "POST",
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
    } else {
      toast.error(data.message);
    }
  };
  // form submit handler
  const onDelete = async (id: string) => {
    setDeletingId(id);
    const response = await fetch(`/api/courses/${courseId}/attachments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data, "form response");
    if (data.success) {
      toast.success("Attachment deleted successfully");
      router.refresh();
      setDeletingId(null);
    } else {
      toast.error(data.message);
      setDeletingId(null);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Resources
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && initialData.attachments.length === 0 && (
            <>
              <PlusCircle size={16} className="mr-1" /> Add attachment
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing && initialData.attachments.length === 0 && (
          <p className={"text-slate-500 italic"}>No Attachments available.</p>
        )}
      </div>
      <div>
        {initialData.attachments.length > 0 &&
          initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="bg-sky-100 border border-sky-200  p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-x-2 w-full  text-sky-700 rounded-md">
                <File className="h-4 w-4 flex-shrink-0" />
                <p className="text-xs line-clamp-1">{attachment.name}</p>
              </div>
              {deletingId === attachment.id ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Button
                  onClick={() => onDelete(attachment.id)}
                  type="button"
                  variant="ghost"
                >
                  <X className=" h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
      </div>

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                console.log(url, "from url 114");
                onSubmit({ url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Add anything(e.g. image, pdf, video) your students might need to
            complete the course.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttachmentFrom;
