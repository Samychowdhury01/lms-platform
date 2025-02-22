import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Course not found",
        data: [],
      });
    }

    if (isPublished) {
      const hasPublishedChapter = course.chapters.some(
        (chapter) => chapter.isPublished
      );
      if (
        !course.title ||
        !course.description ||
        !course.imageUrl ||
        !course.categoryId ||
        !hasPublishedChapter
      ) {
        return NextResponse.json({
          statusCode: 401,
          success: true,
          message: "Missing required fields",
          data: course,
        });
      }

      const publishedCourse = await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: true,
        },
      });

      return NextResponse.json({
        statusCode: 201,
        success: true,
        message: "Course updated successfully",
        data: publishedCourse,
      });
    } else {
      const unpublishedCourse = await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });

      return NextResponse.json({
        statusCode: 201,
        success: true,
        message: "Course updated successfully",
        data: unpublishedCourse,
      });
    }
  } catch (error) {
    console.log("[COURSE_ID_STATUS]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
