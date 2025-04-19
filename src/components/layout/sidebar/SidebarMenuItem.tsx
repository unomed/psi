
import { useNavigate, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem as MenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  path: string;
}

export function SidebarMenuItem({ title, icon: Icon, path }: MenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <MenuItem>
      <SidebarMenuButton
        onClick={() => navigate(path)}
        className={cn(
          "flex items-center w-full",
          isActive && "bg-sidebar-accent"
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        <span>{title}</span>
      </SidebarMenuButton>
    </MenuItem>
  );
}
