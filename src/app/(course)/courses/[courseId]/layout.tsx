import type React from "react";
import { getProgress } from "@/actions/progress-action";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import CourseNavbar from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}) => {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
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

  const progressCount = await getProgress(userId, courseId);

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <CourseSidebar course={course} progressCount={progressCount} />
        <SidebarInset className="flex flex-col w-full">
          <CourseNavbar />
          <div className="flex-1">
            <main className="h-full">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CourseLayout;
