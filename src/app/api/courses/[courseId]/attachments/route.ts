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
    const { url } = await req.json();

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

    if(!course){
        return NextResponse.json({
            statusCode: 401,
            success: false,
            message: "Unauthorized",
            data: [],
          });
    }

    const attachments = await prisma.attachment.create({
        data:{
            url,
            name: url.split("/").pop(),
            courseId,
        }
    })

    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Attachment created successfully successfully",
      data: attachments,
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
