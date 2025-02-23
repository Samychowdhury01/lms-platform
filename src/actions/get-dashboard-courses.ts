"use server";

import { prisma } from "@/lib/prisma";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./progress-action";

type CoursesWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type TDashboardCourses = {
  completedCourses: CoursesWithProgressWithCategory[];
  coursesInProgress: CoursesWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<TDashboardCourses> => {
  try {
    const purchasedCourses = await prisma.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CoursesWithProgressWithCategory[];

    for (const course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = await courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = await courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };

  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
