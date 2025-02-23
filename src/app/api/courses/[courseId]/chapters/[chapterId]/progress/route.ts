import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const chapterId = (await params).chapterId;
    const { isCompleted } = await req.json();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Chapter updated successfully",
      data: userProgress,
    });
  } catch (error) {
    console.log("[COURSE_ID_PROGRESS]:", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
