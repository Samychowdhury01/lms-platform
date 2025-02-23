"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === '/search'
  return (
<>
{isSearchPage && (
  <div className="hidden md:block">
    <SearchInput/>
  </div>
)}
<nav className="flex gap-x-2 ml-auto">
      {isTeacherPage || isCoursePage ? (
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
</>
  );
};

export default NavbarRoutes;
