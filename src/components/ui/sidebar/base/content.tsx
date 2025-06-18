
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface SidebarContentProps extends React.ComponentProps<"div"> {
  asChild?: boolean
}

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  try {
    return (
      <Comp
        ref={ref}
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-hidden group-data-[collapsible=icon]:overflow-visible",
          className
        )}
        {...props}
      >
        <div className="overflow-auto flex-1">
          <div className="flex flex-col gap-2 p-2">
            {children}
          </div>
        </div>
      </Comp>
    )
  } catch (error) {
    console.error('[SidebarContent] Erro na renderização:', error);
    return (
      <div className="flex-1 overflow-auto p-2">
        {children}
      </div>
    );
  }
})
SidebarContent.displayName = "SidebarContent"
