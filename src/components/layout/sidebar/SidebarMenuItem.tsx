
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
  
  // Considerar ativo se o caminho atual corresponde exatamente ou é um subcaminho
  const isActive = location.pathname === path || 
    (path !== "/dashboard" && location.pathname.startsWith(path));

  const handleClick = () => {
    console.log(`[SidebarMenuItem] Navegando para: ${path}`);
    navigate(path);
  };

  return (
    <MenuItem>
      <SidebarMenuButton
        onClick={handleClick}
        className={cn(
          "flex items-center w-full cursor-pointer",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        <span>{title}</span>
      </SidebarMenuButton>
    </MenuItem>
  );
}
