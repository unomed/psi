
import { SidebarProviderRobust } from "@/components/ui/sidebar/SidebarProviderRobust";
import { SidebarErrorBoundary } from "@/components/ui/sidebar/SidebarErrorBoundary";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationProvider } from "@/components/notifications/NotificationService";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarErrorBoundary>
      <NotificationProvider>
        <SidebarProviderRobust>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center space-x-4">
                  {/* Header content can be added here */}
                </div>
              </header>
              <main className="flex-1 overflow-auto p-4">
                {children}
              </main>
            </div>
          </div>
        </SidebarProviderRobust>
      </NotificationProvider>
    </SidebarErrorBoundary>
  );
}
