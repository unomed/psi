
import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useSidebar } from "../context";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn(
      "flex h-[60px] items-center border-b border-sidebar-border px-4",
      className
    )}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn(
      "border-t border-sidebar-border px-4 py-4",
      className
    )}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
