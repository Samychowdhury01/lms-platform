import { getChapter } from "@/actions/chapter-action";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { File } from "lucide-react";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;
  if (!userId) {
    return redirect("/");
  }

  const {
    attachments,
    chapter,
    course,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await getChapter({ chapterId, courseId, userId });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You already completed this chapter." variant="success" />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter!"
          variant="warning"
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        {/* video player */}
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapter={nextChapter?.id!}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        {/* course title and button */}
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="flex-1 text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
              ""
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          {/* description */}
          <div>
            <Preview value={chapter.description!} />
          </div>
          {/* attachments */}
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4 space-y-2">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    key={attachment.id}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <p className="line-clamp-1">
                      <File />
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
