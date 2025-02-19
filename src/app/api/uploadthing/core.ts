import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User is not authenticated");
  return { userId };
};
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Course image upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
  courseAttachment: f(["text", "image", "video", "pdf", "audio"])
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        "Course attachment upload complete for userId:",
        metadata.userId
      );
      console.log("file url", file.url);
    }),
  chapterVideo: f({
    video: {
      maxFileCount: 1,
      maxFileSize: "512GB",
    },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Chapter video upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
