import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const chapterId = (await params).chapterId;
    const { isPublished } = await req.json();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return NextResponse.json({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: [],
      });
    }

    if (isPublished) {
      console.log("from if block");
      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterId,
          courseId,
        },
      });
      const muxData = await prisma.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      if (
        !chapter ||
        !muxData ||
        !chapter.title ||
        !chapter.description ||
        !chapter.videoUrl
      ) {
        return NextResponse.json({
          statusCode: 404,
          success: false,
          message: "Missing required fields!",
          data: [],
        });
      }
    }

    const updatePublishStatus = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished,
      },
    });

    if (!isPublished) {
      console.log("from else block");
      const publishedChaptersInCourse = await prisma.chapter.findMany({
        where: {
          courseId,
        },
      });

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
    }

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Chapter updated successfully",
      data: updatePublishStatus,
    });
  } catch (error) {
    console.log("[COURSE_ID_STATUS]:", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
