"use client";
import { Layout, Compass, List, BarChart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";
import Logo from "./logo";

// Menu items.
const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teachersRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isTeachersRoute = pathname?.startsWith("/teacher");
  const routes = isTeachersRoute ? teachersRoutes : guestRoutes;
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="h-10 m-auto p-4">
                <Logo/>
              </div>
              {routes.map((route) => (
                <SidebarItem key={route.href} route={route} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
