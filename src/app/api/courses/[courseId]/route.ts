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
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const values = await req.json();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.log("[COURSE]", error);
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
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;

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

    // check if the course exists or not
    if (!course) {
      return NextResponse.json({
        statusCode: 404,
        success: false,
        message: "Course not found",
        data: [],
      });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        video.assets.delete(chapter.muxData.assetId);
      }
    }
    const deletedCourse = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Course deleted successfully",
      data: [],
    });
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
