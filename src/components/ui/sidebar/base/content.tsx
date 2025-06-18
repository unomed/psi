
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { SafeScrollArea } from "../../scroll-area-safe"

export interface SidebarContentProps extends React.ComponentProps<"div"> {
  asChild?: boolean
}

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

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
      <SafeScrollArea 
        className="flex-1"
        fallback={<div className="overflow-auto flex-1">{children}</div>}
      >
        <div className="flex flex-col gap-2 p-2">
          {children}
        </div>
      </SafeScrollArea>
    </Comp>
  )
})
SidebarContent.displayName = "SidebarContent"
