import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const CoursesPage = () => {
  return (
    <section>
      <Button asChild>
        <Link href="/teacher/create">
        New Course 
        <PlusCircle/>
        </Link>
      </Button>
    </section>
  );
};

export default CoursesPage;
