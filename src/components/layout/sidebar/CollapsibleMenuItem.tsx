
import React from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LucideIcon } from "lucide-react";

interface CollapsibleMenuItemProps {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  hasSubmenu?: boolean;
  children?: React.ReactNode;
}

export function CollapsibleMenuItem({ 
  title, 
  icon: Icon, 
  isActive = false, 
  hasSubmenu = false,
  children 
}: CollapsibleMenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(isActive);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded-md cursor-pointer">
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          {hasSubmenu && (
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          )}
        </div>
      </CollapsibleTrigger>
      {hasSubmenu && (
        <CollapsibleContent className="ml-4 mt-1">
          <div className="space-y-1">
            {children}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
