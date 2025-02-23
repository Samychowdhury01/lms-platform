"use server";

import { prisma } from "@/lib/prisma";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./progress-action";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type TGetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourse = async ({
  userId,
  title,
  categoryId,
}: TGetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress(userId, course.id);
        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );
    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
