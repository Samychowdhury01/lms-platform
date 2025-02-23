import { prisma } from "@/lib/prisma";
import React from "react";
import CategoriesItem from "./_components/categories-item";
import SearchInput from "@/components/search-input";
import { getCourse } from "@/actions/course-action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseList from "./_components/course-list";

type SearchPageProps = {
  searchParams?: Promise<{
    title: string;
    categoryId: string;
  }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;
  if (!userId) {
    return redirect("/");
  }
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourse({
    userId,
    ...resolvedSearchParams,
  });

  return (
    <section>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <CategoriesItem items={categories} />
        <CourseList items={courses} />
      </div>
    </section>
  );
};

export default SearchPage;
