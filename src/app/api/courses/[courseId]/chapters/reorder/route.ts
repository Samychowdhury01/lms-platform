import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const { list } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", {
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

 for(let item of list){
    await prisma.chapter.update({
        where: {
            id: item.id,
        },
        data: {
            position: item.position,
        }
    })
 }

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Chapter reordered successfully",
      data: course,
    });
  } catch (error) {
    console.log("[REORDER]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
