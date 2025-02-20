import { IconBadge } from "@/components/ui/icon-badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterFromTitle from "./_components/chapter-title-form";
import ChapterFormDescription from "./_components/chapter-form-description";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterFormVideo from "./_components/chapter-video-form";

interface ChapterAddPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

const ChapterAddPage = async ({ params }: ChapterAddPageProps) => {
  const resolvedParams = await params;
  const courseId = resolvedParams.courseId;
  const chapterId = resolvedParams.chapterId;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });
  if (!chapter) {
    return redirect("/");
  }
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <p className="text-sm text-slate-700">
                Complete all fields {completionText}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-5">
          <div>
            {/* title and icon */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-lg">Customize your chapter</h2>
            </div>
            {/* Chapter titleForm */}
            <ChapterFromTitle
              chapterId={chapterId}
              initialData={chapter}
              courseId={courseId}
            />
            <ChapterFormDescription
              chapterId={chapterId}
              initialData={chapter}
              courseId={courseId}
            />
          </div>
          <div>
            {/* title and icon */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-lg">Access Setting</h2>
            </div>
            <ChapterAccessForm
              chapterId={chapterId}
              initialData={chapter}
              courseId={courseId}
            />
          </div>
        </div>
        {/* video container */}
        <div>
            {/* title and icon */}
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-lg">Add Video</h2>
            </div>
            <ChapterFormVideo
              chapterId={chapterId}
              initialData={chapter}
              courseId={courseId}
            />
          </div>
      </div>
    </section>
  );
};

export default ChapterAddPage;
