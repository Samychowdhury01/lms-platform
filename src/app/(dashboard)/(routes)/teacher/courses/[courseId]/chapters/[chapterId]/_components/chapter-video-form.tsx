"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";
import { Chapter, MuxData } from "@prisma/client";
import { TChapterVideoUrl } from "@/schema/chapter-validation-schema";
import MuxPlayer from '@mux/mux-player-react/lazy'

type TChapterVideoFromProps = {
  courseId: string;
  initialData: Chapter & { muxData?: MuxData | null };
  chapterId: string;
};

const ChapterFormVideo = ({
  courseId,
  initialData,
  chapterId,
}: TChapterVideoFromProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // form submit handler
  const onSubmit = async (value: TChapterVideoUrl) => {
    const response = await fetch(
      `/api/courses/${courseId}/chapters/${chapterId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: value.videoUrl,
        }),
      }
    );
    const data = await response.json();

    if (data.success) {
      toast.success("Chapter updated successfully");
      router.refresh();
      toggleEdit();
    } else {
      toast.error(data.message);
    }
  };
  const toggleEdit = () => setIsEditing((current) => !current);
  
  console.log("Mux Playback ID:", initialData?.muxData?.playbackId);

  
  
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button type="button" variant={"ghost"} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle size={16} className="mr-1" /> Add video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil size={16} className="mr-1" /> Edit video
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing &&
          (!initialData.videoUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <Video className="text-slate-500 h-10 w-10" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
              <MuxPlayer
              playbackId={initialData?.muxData?.playbackId|| ''}

              />
            </div>
          ))}
      </div>
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4 text-center">
            upload this chapter's video
          </p>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <p className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </p>
      )}
    </div>
  );
};

export default ChapterFormVideo;
