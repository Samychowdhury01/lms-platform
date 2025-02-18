import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();
    console.log(userId, "from server");

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const course = await prisma.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json({
      statusCode: 201,
      success: true,
      message: "Course created successfully",
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
