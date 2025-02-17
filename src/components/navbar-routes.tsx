"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isStudentPage = pathname?.startsWith("/chapter");
  return (
    <nav className="flex gap-x-2 ml-auto">
      {isTeacherPage || isStudentPage ? (
        <Button asChild size="sm">
          <Link href="/">
            <LogOut size={4} className="mr-0.5" /> Exit
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href="/teacher/courses">Teacher Mode</Link>
        </Button>
      )}
      <UserButton />
    </nav>
  );
};

export default NavbarRoutes;
