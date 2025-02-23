import type { Chapter, Course, UserProgress } from "@prisma/client";
import { Book, CheckCircle, Lock } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SidebarChapterItem from "./sidebar-chapter-item";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <Sidebar className="h-full border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <h2 className="font-semibold tracking-tight">{course.title}</h2>
        <p className="text-sm text-muted-foreground">
          {progressCount}/{course.chapters.length} lessons completed
        </p>
        {/* check progress and add progress bar */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Course Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {course.chapters.map((chapter) => (
                <SidebarMenuItem key={chapter.id}>
                  <SidebarChapterItem
                    id={chapter.id}
                    label={chapter.title}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    courseId={chapter.courseId}
                    isLocked= {!chapter.isFree && !purchase}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default CourseSidebar;
