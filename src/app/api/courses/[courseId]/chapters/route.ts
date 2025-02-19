import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const { title } = await req.json();

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

    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await prisma.chapter.create({
        data: {
            title,
            courseId,
            position: newPosition,

        }
    })

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Chapter created successfully",
      data: chapter,
    });
  } catch (error) {
    console.log("[CHAPTER]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
