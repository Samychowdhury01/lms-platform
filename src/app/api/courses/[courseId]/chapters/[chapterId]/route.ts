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
    const {isPublished, ...values} = await req.json();
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
    console.log(chapter)
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
