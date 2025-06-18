
import * as React from "react"
import { cn } from "@/lib/utils"

// TOOLTIP NATIVO SIMPLES - SEM RADIX UI
const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { 
    delayDuration?: number;
    children: React.ReactNode;
  }
>(({ delayDuration = 300, children, className, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
))
TooltipProvider.displayName = "TooltipProvider"

const Tooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { children: React.ReactNode }
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("relative inline-block group", className)} {...props}>
    {children}
  </div>
))
Tooltip.displayName = "Tooltip"

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { 
    asChild?: boolean;
    children: React.ReactNode;
  }
>(({ asChild = false, children, className, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(className, children.props.className),
    });
  }

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { 
    sideOffset?: number;
    children: React.ReactNode;
  }
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      "absolute top-full left-1/2 transform -translate-x-1/2 mt-1",
      "opacity-0 pointer-events-none transition-opacity",
      "group-hover:opacity-100 group-hover:pointer-events-auto",
      className
    )}
    style={{ marginTop: sideOffset }}
    {...props}
  >
    {children}
  </div>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
