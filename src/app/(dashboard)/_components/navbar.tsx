import NavbarRoutes from "@/components/navbar-routes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center border-b  p-4 shadow-sm w-full">
      <SidebarTrigger className="md:hidden" />
      <NavbarRoutes />
    </header>
  );
};

export default Navbar;
