import CourseCard from "@/components/course-card";
import { Category, Course } from "@prisma/client";
import React from "react";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface TCourseListProps {
  items: CourseWithProgressWithCategory[];
}

const CourseList = ({ items }: TCourseListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard key={item.id} 
          
          id={item.id}
          title={item.title}
          category={item?.category?.name!}
          imageUrl={item?.imageUrl!}
          chaptersLength={item.chapters.length}
          price={item.price!}
          progress={item.progress}
          />
        ))}
        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
