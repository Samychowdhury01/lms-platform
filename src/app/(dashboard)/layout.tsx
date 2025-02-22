

import React from "react";
import Navbar from "./_components/navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <Navbar />
          <div className="flex-1">
            <main className="h-full">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;