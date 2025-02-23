"use client";

import React, { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapter: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapter,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false)
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="size-8 " />
          <p className="text-sm">This chapter is locked. Please purchase for access.</p>
        </div>
      )}
      {
        !isLocked && (
            <MuxPlayer
            playbackId={playbackId}
            title={title}
            className={cn(
                !isReady && "hidden"
            )}
            onCanPlay={()=> setIsReady(true)}
            onEnded={()=>{}}
            autoPlay
            />
        )
      }
    </div>
  );
};

export default VideoPlayer;
