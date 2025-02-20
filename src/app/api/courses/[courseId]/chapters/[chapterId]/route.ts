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
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const courseId = (await params).courseId;
    const chapterId = (await params).chapterId;
    const { isPublished, ...values } = await req.json();
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

    if (values.videoUrl) {
      const existingMuxData = await prisma.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await prisma.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await video.assets.create({
        input: [
          {
            url: values.videoUrl,
          },
        ],
        playback_policy: ["public"],
        test: false,
      });
      
       await prisma.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: chapterId,
          playbackId: asset.playback_ids?.[0]?.id!,
        },
      });
    }
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
