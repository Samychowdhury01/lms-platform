import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const attachmentId = (await params).attachmentId;


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

    const attachments = await prisma.attachment.delete({
      where: {
        courseId,
        id: attachmentId,

      },
    });

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Attachment deleted successfully successfully",
      data: attachments,
    });
  } catch (error) {
    console.log("[COURSE_ATTACHMENT_ID]", error);
    return NextResponse.json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}
