"use client";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname,  } from "next/navigation";
import React from "react";

type TSidebarItemProps = {
  route: {
    icon: LucideIcon;
    label: string;
    href: string;
  };
};
const SidebarItem = ({
  route: { icon: Icon, label, href },
}: TSidebarItemProps) => {
  const pathname = usePathname();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname.startsWith(`${href}/`);

  return (
    <SidebarMenuItem
      key={href}
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 py-4",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700 border-sky-700 border-r-4"
      )}
    >
      <SidebarMenuButton asChild>
        <a href={href}>
          <Icon
            size={22}
            className={cn("text-slate-500", isActive && "text-sky-700")}
          />
          <span>{label}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarItem;
