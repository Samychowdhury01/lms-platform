import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CoursesPage = () => {
  return (
    <section>
      <Button asChild>
        <Link href="/teacher/create">New Course</Link>
      </Button>
    </section>
  );
};

export default CoursesPage;
