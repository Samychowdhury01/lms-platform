import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{
    courseId: string;
  }>;
}) => {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
