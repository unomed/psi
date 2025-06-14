
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfileMenu } from "./UserProfileMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationProvider } from "@/components/notifications/NotificationService";

export default function MainLayout() {
  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="border-b p-4 flex items-center justify-between">
              <SidebarTrigger />
              <div className="flex items-center gap-4">
                <NotificationBell />
                <UserProfileMenu />
              </div>
            </header>
            <div className="flex-1 p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
}
