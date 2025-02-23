"use server";

import { prisma } from "@/lib/prisma";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  chapterId: string;
  courseId: string;
}

export const getChapter = async ({
  chapterId,
  courseId,
  userId,
}: GetChapterProps) => {
  try {
    // get the purchase
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    // get the course
    const course = await prisma.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });
    // get the chapter
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error("chapter or course not found!");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await prisma.attachment.findMany({
        where: {
          courseId,
        },
      });
    }
    if (chapter?.isFree || purchase) {
      muxData = await prisma.muxData.findUnique({
        where: {
          chapterId,
        },
      });
      nextChapter = await prisma.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    // user progress
    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[ERROR_AT_GET_CHAPTER (line 16)]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
