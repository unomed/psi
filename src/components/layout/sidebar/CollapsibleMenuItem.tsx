
import React from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuItem } from "./types";

interface CollapsibleMenuItemProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleMenuItem({ item, isOpen, onToggle }: CollapsibleMenuItemProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded-md cursor-pointer">
          <div className="flex items-center gap-3">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-4 mt-1">
        <div className="space-y-1">
          {item.submenu?.map((subItem) => (
            <SidebarMenuItem 
              key={subItem.label} 
              item={subItem} 
              isSubItem={true}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
