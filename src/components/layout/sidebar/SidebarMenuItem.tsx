
import { useLocation, useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemBase,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarMenuItemProps {
  title: string;
  icon: LucideIcon;
  href?: string;
  isActive?: boolean;
  children?: React.ReactNode;
  hasSubmenu?: boolean;
}

export function SidebarMenuItem({ 
  title, 
  icon: Icon, 
  href, 
  isActive = false, 
  children, 
  hasSubmenu = false 
}: SidebarMenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (href && !hasSubmenu) {
      console.log(`[SidebarMenuItem] Navegando para: ${href}`);
      navigate(href);
    } else if (hasSubmenu) {
      setIsOpen(!isOpen);
    }
  };

  const isCurrentPath = location.pathname === href || isActive;

  if (hasSubmenu) {
    return (
      <Collapsible
        asChild
        value={isOpen ? "open" : "closed"}
        onValueChange={(value) => setIsOpen(value === "open")}
      >
        <SidebarMenuItemBase>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={handleClick} isActive={isCurrentPath}>
              <Icon className="mr-2 h-4 w-4" />
              <span>{title}</span>
              <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {children}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItemBase>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItemBase>
      <SidebarMenuButton onClick={handleClick} isActive={isCurrentPath}>
        <Icon className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItemBase>
  );
}

export function SidebarMenuSubItemComponent({ 
  title, 
  href, 
  isActive = false 
}: { 
  title: string; 
  href: string; 
  isActive?: boolean; 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    console.log(`[SettingsSubmenu] Navegando para: ${href}`);
    navigate(href);
  };

  const isCurrentPath = location.pathname === href || isActive;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton onClick={handleClick} isActive={isCurrentPath}>
        <span>{title}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
