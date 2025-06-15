
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProfileMenu } from "./UserProfileMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NotificationProvider } from "@/components/notifications/NotificationService";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FadeIn } from "@/components/ui/fade-in";
import { PageTransition } from "@/components/ui/page-transition";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background transition-colors duration-300">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-200">
              <div className="flex h-14 items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="transition-transform duration-200 hover:scale-105" />
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <ThemeToggle />
                  <NotificationBell />
                  <UserProfileMenu />
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-auto">
              <PageTransition>
                <div className="p-4 sm:p-6 lg:p-8">
                  {children || <Outlet />}
                </div>
              </PageTransition>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
}
