"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FileUpload from "@/components/file-upload";


type TFromTitleProps = {
  courseId: string;
  initialData: {
    imageUrl: string | null;
  };
};

const ImageFrom = ({ courseId, initialData }: TFromTitleProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);


  // form submit handler
  const onSubmit = async (value: { imageUrl: string }) => {
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
    } else {
      toast.error(data.message);
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle size={16} className="mr-1" /> Add Image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil size={16} className="mr-1" /> Edit Image
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing &&
          (!initialData.imageUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className="text-slate-500 h-10 w-10" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <Image
                alt="course image"
                src={initialData?.imageUrl}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ))}
      </div>
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                console.log(url, 'from url 114')
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            16:9 aspect ratio recommended!
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageFrom;
