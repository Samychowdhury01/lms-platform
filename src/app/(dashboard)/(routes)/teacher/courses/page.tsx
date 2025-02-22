import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CourseDataTable } from "./_components/course-data-table";
import { courseColumns } from "./_components/course-columns";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="p-3">
      <div className="mt-5">
        <CourseDataTable columns={courseColumns} data={courses} />
      </div>
    </section>
  );
};

export default CoursesPage;
