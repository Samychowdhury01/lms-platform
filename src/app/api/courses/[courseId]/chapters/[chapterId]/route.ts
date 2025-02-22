import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// mux setup
const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const chapterId = (await params).chapterId;
    const { isPublished, ...values } = await req.json();
    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await prisma.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await video.assets.create({
        input: [
          {
            url: values.videoUrl,
          },
        ],
        playback_policy: ["public"],
        test: false,
      });

      await prisma.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: chapterId,
          playbackId: asset.playback_ids?.[0]?.id!,
        },
      });
    }
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Chapter updated successfully",
      data: chapter,
    });
  } catch (error) {
    console.log("[CHAPTER_CHAPTER_ID PATCH]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const chapterId = (await params).chapterId;

    // return if there's no user
    if (!userId) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    // return if there's no course with the course id and user id
    if (!course) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    // return if there's no chapter with the chapter id and course id
    if (!chapter) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Chapter not found",
        data: [],
      });
    }

    // check if there's any video url if there's any video url than delete the video from mux at the same time from the database
    if (chapter.videoUrl) {
      const existingMuxData = await prisma.muxData.findFirst({
        where: {
          chapterId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }
    // delete the chapter from the database
    const deleteChapter = await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    // check if there any other chapter in the course
    const publishedChaptersInCourse = await prisma.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    // if there's no other chapter then unpublish the course
    if (!publishedChaptersInCourse.length) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Successfully deleted the chapter",
      data: [],
    });
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
