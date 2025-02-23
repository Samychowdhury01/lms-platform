"use client";

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
  const {userId} = useAuth()
  console.log(userId, 'hiiiiiiiiii')
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === "/search";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <nav className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Button asChild size="sm">
            <Link href="/">
              <LogOut size={4} className="mr-0.5" /> Exit
            </Link>
          </Button>
        ) : isTeacher(userId) ? (
          <Button asChild variant="outline" size="sm">
            <Link href="/teacher/courses">Teacher Mode</Link>
          </Button>
        ) : null}
        <UserButton />
      </nav>
    </>
  );
};

export default NavbarRoutes;
