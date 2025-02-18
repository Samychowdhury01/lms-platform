import { IconBadge } from "@/components/ui/icon-badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import FormTitle from "./_components/form-title";
import FormDescriptionUpdate from "./_components/form-description";

type TNewCoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

const NewCoursePage = async ({ params }: TNewCoursePageProps) => {
  const resolvedParams = await params;
  const courseId = resolvedParams.courseId;
  const { userId } = await auth();
  if (!userId) {
    return notFound();
  }
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });
  if (!course?.id) {
    return notFound();
  }
  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.imageUrl,
    course.price,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <p className="text-sm text-slate-700">
            Complete all fields {completionText}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2>Customize your course</h2>
          </div>
          <FormTitle courseId={course?.id} initialData={course} />
          <FormDescriptionUpdate courseId={course?.id} initialData={course} />
        </div>
      </div>
    </section>
  );
};

export default NewCoursePage;
