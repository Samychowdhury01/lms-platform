import { IconBadge } from "@/components/ui/icon-badge";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListCheck,
} from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import FormTitle from "./_components/form-title";
import FormDescriptionUpdate from "./_components/form-description";
import ImageFrom from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentFrom from "./_components/attachment-form";
import ChapterForm from "./_components/capters-form";
import Banner from "@/components/banner";
import CourseActions from "./_components/course-action";

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
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "desc",
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
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);
  return (
  <>
  {
    !course.isPublished && <Banner
    label="This course is unpublished. It won't be visible to student."
    />
  }
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <p className="text-sm text-slate-700">
            Complete all fields {completionText}
          </p>
        </div>
        {/* actions button */}
        <CourseActions
        isPublished={course.isPublished}
        courseId={courseId}
        disabled={!isComplete}

        />

      </div>
      {/* main container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* container for form fields and others */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <FormTitle courseId={course?.id} initialData={course} />
          <FormDescriptionUpdate courseId={course?.id} initialData={course} />
          <ImageFrom courseId={course?.id} initialData={course} />
          <CategoryForm
            courseId={course?.id}
            initialData={course}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        </div>
        {/* video and attachments */}
        <div className="space-y-6">
          {/*  for chapter container*/}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl">Course chapters</h2>
            </div>
            <ChapterForm courseId={course?.id} initialData={course} />
          </div>
          {/* selling container */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm courseId={courseId} initialData={course} />
          </div>
          {/* attachments */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-lg">Resources and Attachments</h2>
            </div>
            <AttachmentFrom courseId={course?.id} initialData={course} />
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default NewCoursePage;
